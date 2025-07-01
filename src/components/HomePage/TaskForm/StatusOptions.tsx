import React from "react";

interface StatusOptionsProps {
  selectedStatus: "completed" | "in-progress" | "pending";
  onStatusChange: (status: "completed" | "in-progress" | "pending") => void;
}

function StatusOptions({ selectedStatus, onStatusChange }: StatusOptionsProps) {
  return (
    <div className="w-32 rounded-lg border-[1px] ">
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as StatusOptionsProps["selectedStatus"])}
        className="w-full rounded-lg border-[1px] p-2 bg-white"
      >
        <option value="completed">Completed</option>
        <option value="in-progress">In-progress</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}

export default StatusOptions;