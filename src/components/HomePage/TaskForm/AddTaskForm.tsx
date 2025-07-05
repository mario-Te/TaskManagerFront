import React, { useState, useEffect } from "react";
import { CiFlag1 } from "react-icons/ci";
import PriorityOptions from "./PriorityOptions";
import StatusOptions from "./StatusOptions";
import { useAppDispatch } from "../../../hooks/dispatcHook";
import {
  addTaskAsync,
  fetchTasks,
  updateTaskAsync,
} from "../../../redux/taskSlice";
import { Task, TaskStatus, TaskPriority } from "../../../types/task";
import { Member } from "../../../redux/memberSlice";

interface AddTaskFormProps {
  closeForm: () => void;
  editTask?: Task | null;
  members?: Array<Member>; // Add members prop
}

function AddTaskForm({ closeForm, editTask, members = [] }: AddTaskFormProps) {
  // State with proper typing
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>("low");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("pending");
  const [assignedMember, setAssignedMember] = useState<string>(""); // State for assigned member
  
  const dispatch = useAppDispatch();

  // Initialize form with edit data if available
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setSelectedPriority(editTask.priority);
      setSelectedStatus(editTask.status);
      if (editTask.assignedTo) {
        setAssignedMember(editTask.assignedTo);
      }
    }
  }, [editTask]);

  // Event handlers with proper typing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleStatusChange = (status: TaskStatus) => {
    setSelectedStatus(status);
  };

  const handlePrioritySelect = (priority: TaskPriority) => {
    setSelectedPriority(priority);
  };

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignedMember(e.target.value);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const taskData: Omit<Task, '_id'> & { assignedTo?: string } = {
      title,
      description,
      status: selectedStatus,
      priority: selectedPriority,
    };

    // Only include assignedTo if a member is selected
    if (assignedMember) {
      taskData.assignedTo = assignedMember;
    }

    try {
      if (editTask) {
        await dispatch(
          updateTaskAsync({ ...taskData, _id: editTask._id })
        );
      } else {
        await dispatch(addTaskAsync(taskData));
        dispatch(fetchTasks());
      }
      closeForm();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <div className="rounded-xl shadow-2xl">
      <form
        className="flex flex-col gap-2 rounded-xl bg-white p-2"
        onSubmit={handleSubmit}
      >
        {/* Task name */}
        <input
          className="border-none bg-white font-bold text-gray-500 outline-none focus:ring-0"
          placeholder="Task name"
          required
          value={title}
          onChange={handleTitleChange}
        />

        {/* Description */}
        <input
          className="border-none bg-white text-lg text-gray-500 outline-none focus:ring-0"
          placeholder="Description"
          required
          value={description}
          onChange={handleDescriptionChange}
        />

        {/* Member assignment */}
      
        {/* Options */}
        <div className="flex gap-2 border-b-2">
          <div className="mt-4 pb-2">
            <PriorityOptions 
              selectedPriority={selectedPriority}
              onSelect={handlePrioritySelect}
            />
          </div>
          <div className="mt-4 pb-2">
            <StatusOptions
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-2 border-t pt-2">
          <button
            type="button"
            className="rounded-sm bg-gray-100 p-2 font-bold hover:bg-gray-200"
            onClick={closeForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`rounded-sm p-2 font-bold text-white ${
              title && description
                ? "bg-[#DC4C3E] hover:bg-[#BF3B2D]"
                : "cursor-not-allowed bg-[#EDA59E]"
            }`}
            disabled={!title || !description}
          >
            {editTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTaskForm;