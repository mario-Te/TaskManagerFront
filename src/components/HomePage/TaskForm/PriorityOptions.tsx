// PriorityOptions.tsx
import React from "react";

type PriorityLevel = "low" | "medium" | "high";

interface PriorityOptionsProps {
  selectedPriority: PriorityLevel;
  onSelect: (priority: PriorityLevel) => void;
}

function PriorityOptions({ selectedPriority, onSelect }: PriorityOptionsProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const priority = event.target.value as PriorityLevel;
    onSelect(priority);
  };

  return (
    <div className="w-32">
      <select
        value={selectedPriority}
        onChange={handleSelectChange}
        className="w-full rounded-lg border-2 py-2 bg-white"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}

export default PriorityOptions;