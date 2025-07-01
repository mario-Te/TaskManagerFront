import React from "react";

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-gray-500";
      default:
        return "";
    }
  };

  return (
    <span
      className={`flex justify-center rounded-full p-2 font-bold text-white ${getPriorityClass(priority)}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
