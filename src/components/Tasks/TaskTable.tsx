import React, { ReactNode, FC, useState } from "react";
import styles from "./TaskTable.module.css";
import { Task } from "../../types/task";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { RegisterFormProvider } from "../../contexts/RegisterFormContext";
import AddTaskForm from "../HomePage/TaskForm/AddTaskForm";
import { useAppDispatch } from "../../hooks/dispatcHook";
import { deleteTaskAsync } from "../../redux/taskSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
interface TaskTableProps {
  tasks: Task[];
}
const TaskTable:React.FC<TaskTableProps> = ({tasks}) => {
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const dispatch = useAppDispatch();
  console.log(`task table: ${tasks}`);
  // EDIT FORM TOGGLE
  function toggleTaskForm() {
    setShowTaskForm(!showTaskForm);
  }

  function formCloseHandler() {
    setShowTaskForm(false); // Close form on cancel or submission
    setEditingTask(null);
  }

  // DELETE
  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTaskAsync(taskId)).unwrap();
      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };
  // EDIT
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    toggleTaskForm(); // Show the form
  };
  const handleTaskUpdate = (updatedTask: Task) => {
    console.log("Updated task: " + updatedTask);
    formCloseHandler();
  };
  return (
    <>
    { tasks.length>0 &&
      <table className={`text-sm ${styles.taskTable}`}>
        <thead>
          <tr>
            <th>Title</th>
            <th className="w-[40%]">Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        
            <tbody >
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <StatusBadge status={task.status} />
              </td>
              <td>
                <PriorityBadge priority={task.priority} />
              </td>
              <td>
                <Button onClick={() => handleEditTask(task)}>Edit</Button>
                <Button onClick={() => handleDeleteTask(task._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
        }
      <div
        className={`absolute left-[25%] z-50 w-1/2 ${showTaskForm ? "block" : "hidden"}`}
      >
        <RegisterFormProvider>
          <AddTaskForm
            closeForm={formCloseHandler}
            // onSubmit={handleTaskUpdate}
            editTask={editingTask} // Pass selected task data
          />
        </RegisterFormProvider>
      </div>
    </>
  );
};

export default TaskTable;

// BUTTON
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="rounded bg-[#E44232] px-4 py-2 font-bold text-white hover:bg-[#F07A6E]"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

/*
Task Interface: Defines the structure of a single task, including its properties like _id, title, description, status, and priority.

TaskTableProps Interface: Defines the structure of the tasks prop, which is an array of Task objects.

React.FC<TaskTableProps>: Specifies that TaskTable is a React functional component that accepts TaskTableProps.*/
