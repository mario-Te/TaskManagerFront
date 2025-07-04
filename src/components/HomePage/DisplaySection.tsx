import React from "react";
import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AddTaskForm from "./TaskForm/AddTaskForm";
import TaskTable from "../Tasks/TaskTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { Task } from "../../types/task";
import { RegisterFormProvider } from "../../contexts/RegisterFormContext";
import { addTaskAsync, fetchTasks } from "../../redux/taskSlice";
import {  fetchMembers, fetchTeamMembers } from "../../redux/memberSlice";
import { fetchTeams } from "../../redux/teamSlice";
import AddMemberForm from "./Memberform/AddMemberForm";
import MemberTable from "../Members/MemberTable";
import TeamTable from "../Teams/TeamTable";
import AddTeamForm from "./TeamForm/addTeamForms";

interface DisplaySectionProps {
  activeView: 'tasks' | 'members' | 'teams';
}

function DisplaySection({ activeView }: DisplaySectionProps) {
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [showMemberForm, setShowMemberForm] = useState<boolean>(false);
  const [showTeamForm, setShowTeamForm] = useState<boolean>(false);
  
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector(
    (state: RootState) => state.tasks
  );
  const { allMembers ,teamMembers} = useSelector(
    (state: RootState) => state.members
  );
  const { teams, loading: teamsLoading, error: teamsError } = useSelector(
    (state: RootState) => state.teams
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTeamMembers());
    dispatch(fetchMembers())
    dispatch(fetchTeams());
  }, [dispatch]);

  function toggleTaskForm() {
    setShowTaskForm(!showTaskForm);
    if (showMemberForm) setShowMemberForm(false);
    if (showTeamForm) setShowTeamForm(false);
  }

  function toggleMemberForm() {
    setShowMemberForm(!showMemberForm);
    if (showTaskForm) setShowTaskForm(false);
    if (showTeamForm) setShowTeamForm(false);
  }

  function toggleTeamForm() {
    setShowTeamForm(!showTeamForm);
    if (showTaskForm) setShowTaskForm(false);
    if (showMemberForm) setShowMemberForm(false);
  }

  function formCloseHandler() {
    setShowTaskForm(false);
    setShowMemberForm(false);
    setShowTeamForm(false);
  }

  return (
    <div className="h-/12 relative w-full p-12 pt-24">
      {/* Conditional buttons based on active view */}
      <div className="flex gap-4 mb-4">
        {activeView === 'tasks' && (
          <button
            className="flex items-center gap-2 hover:text-[#DC4C3E]"
            onClick={toggleTaskForm}
          >
            <FaPlusCircle />
            Add task
          </button>
        )}
        {activeView === 'members' && (
          <button
            className="flex items-center gap-2 hover:text-[#DC4C3E]"
            onClick={toggleMemberForm}
          >
            <FaPlusCircle />
            Add team member
          </button>
        )}
        {activeView === 'teams' && (
          <button
            className="flex items-center gap-2 hover:text-[#DC4C3E]"
            onClick={toggleTeamForm}
          >
            <FaPlusCircle />
            Add team
          </button>
        )}
      </div>

      {/* Task Form */}
      {activeView === 'tasks' && (
        <div
          className={`absolute left-[25%] z-50 w-1/2 ${showTaskForm ? "block" : "hidden"}`}
        >
          <RegisterFormProvider>
            {allMembers.loading ? (
              <div>Loading members...</div>
            ) : allMembers.error ? (
              <div>Error loading members: {allMembers.error}</div>
            ) : (
              <AddTaskForm
                closeForm={formCloseHandler}
                members={allMembers.members}
              />
            )}
          </RegisterFormProvider>
        </div>
      )}

      {/* Member Form */}
      {activeView === 'members' && (
        <div
          className={`absolute left-[25%] z-50 w-1/2 ${showMemberForm ? "block" : "hidden"}`}
        >
          <RegisterFormProvider>
            <AddMemberForm
              closeForm={formCloseHandler}
            />
          </RegisterFormProvider>
        </div>
      )}

      {/* Team Form */}
      {activeView === 'teams' && (
        <div
          className={`absolute left-[25%] z-50 w-1/2 ${showTeamForm ? "block" : "hidden"}`}
        >
          <RegisterFormProvider>
            <AddTeamForm
              closeForm={formCloseHandler}
              members={allMembers.members}
            />
          </RegisterFormProvider>
        </div>
      )}

      {/* Conditional content based on active view */}
      {activeView === 'tasks' ? (
        tasksLoading ? (
          <div>Loading tasks...</div>
        ) : tasksError ? (
          <div>Error loading tasks: {tasksError}</div>
        ) : (
          <TaskTable tasks={tasks} />
        )
      ) : activeView === 'members' ? (
        teamMembers.members ? (
          <MemberTable members={teamMembers.members} />   
        ) : teamMembers.error ? (
          <div>Error loading members: {allMembers.error}</div>
        ) : (
         <div>Loading ...</div>
        )
      ) : (
        teamsLoading ? (
          <div>Loading teams...</div>
        ) : teamsError ? (
          <div>Error loading teams: {teamsError}</div>
        ) : (
          <TeamTable teams={teams} />
        )
      )}
    </div>
  );
}

export default DisplaySection;