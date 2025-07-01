import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getPriorityClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "";
    }
  };

  return (
    <span
      className={`flex justify-center rounded-full p-2 font-bold text-white ${getPriorityClass(status)}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
