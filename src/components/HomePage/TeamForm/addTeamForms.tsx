import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { createTeam } from "../../../redux/teamSlice";
import { Member } from "../../../redux/memberSlice";

interface AddTeamFormProps {
  closeForm: () => void;
  members: Member[];
}

const AddTeamForm: React.FC<AddTeamFormProps> = ({ closeForm, members }) => {
  const dispatch: AppDispatch = useDispatch();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error("Team name is required");
      }

      await dispatch(createTeam({
          name: name.trim(),
          members: selectedMembers,
          description: description
      })).unwrap();

      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMemberSelection = (memberId: Member) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Members
          </label>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {members.map(member => (
              <div key={member._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`member-${member._id}`}
                  checked={selectedMembers.includes(member)}
                  onChange={() => toggleMemberSelection(member)}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <label htmlFor={`member-${member._id}`}>
                  {member.name} ({member.email})
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeamForm;