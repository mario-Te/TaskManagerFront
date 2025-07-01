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
import { fetchMembers } from "../../redux/memberSlice"; // Import the fetchMembers action

function DisplaySection() {
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector(
    (state: RootState) => state.tasks
  );
  const { members, loading: membersLoading, error: membersError } = useSelector(
    (state: RootState) => state.members
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchMembers()); // Fetch members when component mounts
  }, [dispatch]);

  function toggleTaskForm() {
    setShowTaskForm(!showTaskForm);
  }

  function formCloseHanlder() {
    setShowTaskForm(!showTaskForm);
  }

  return (
    <div className="h-/12 relative w-full p-12 pt-24">
      <div className="tasks flex flex-col">
        <button
          className="flex items-center gap-2 hover:text-[#DC4C3E]"
          onClick={toggleTaskForm}
        >
          <FaPlusCircle />
          Add task
        </button>
        <div
          className={`absolute left-[25%] z-50 w-1/2 ${showTaskForm ? "block" : "hidden"}`}
        >
          <RegisterFormProvider>
            {membersLoading ? (
              <div>Loading members...</div>
            ) : membersError ? (
              <div>Error loading members: {membersError}</div>
            ) : (
              <AddTaskForm
                closeForm={formCloseHanlder}
                members={members}
              />
            )}
          </RegisterFormProvider>
        </div>
        {tasksLoading ? (
          <div>Loading tasks...</div>
        ) : tasksError ? (
          <div>Error loading tasks: {tasksError}</div>
        ) : (
          <TaskTable tasks={tasks} />
        )}
      </div>
    </div>
  );
}

export default DisplaySection;