import React from "react";

interface NameInputProps {
  name: string;
  handleName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

const NameInput: React.FC<NameInputProps> = ({ name, handleName, errors }) => {
  return (
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Full Name *
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={handleName}
        className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
        placeholder="Enter your full name"
      />
      {errors.name && (
        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
      )}
    </div>
  );
};

export default NameInput;