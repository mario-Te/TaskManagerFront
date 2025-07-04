import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { createTeam, createTeamMember, fetchTeams } from "../../../redux/teamSlice";
import { fetchMembers } from "../../../redux/memberSlice";

interface AddNewTeamMemberProps {
  closeForm: () => void;
}

const AddNewTeamMember: React.FC<AddNewTeamMemberProps> = ({ closeForm }) => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    teamName: "",
    team: "",
    members: ""
  });

  // Get data from Redux store
  const { allMembers } = useSelector((state: RootState) => state.members);
  const { 
    teams, 
    loading: teamsLoading,
    error: teamsError,
  } = useSelector((state: RootState) => state.teams);

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchTeams())
  }, [dispatch]);

  const handleTeamSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    if (errors.team) setErrors({...errors, team: ""});
    
    // Pre-select members when a team is chosen
    if (teamId) {
      const team = teams.find(t => t._id === teamId);
    } else {
      setSelectedMembers([]);
    }
  };

  const handleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    const newErrors = { teamName: "", team: "", members: "" };

   
    if (selectedMembers.length === 0) {
      newErrors.members = "Please select at least one member";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {

      await dispatch(createTeamMember({
        teamId: selectedTeam,
        userId: selectedMembers
      })).unwrap();
      
      closeForm();
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  };

  if (teamsError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p className="text-red-500 mb-4">{teamsError}</p>
        <button
          onClick={closeForm}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Team Members</h2>
      <form onSubmit={handleSubmit}>
    

        <div className="mb-4">
          <label htmlFor="teamSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select Team to Copy Members From (Optional)
          </label>
          <select
            id="teamSelect"
            value={selectedTeam}
            onChange={handleTeamSelection}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={teamsLoading}
          >
            <option value="">Select a team (optional)</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name} ({team.members?.length || 0} members)
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Members *
          </label>
          {allMembers.loading ? (
            <p className="text-gray-500">Loading members...</p>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded p-2">
              {allMembers.members.map((user) => (
                <div key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`member-${user.email}`}
                    checked={selectedMembers.includes(user._id!)}
                    onChange={() => handleMemberSelection(user._id!)}
                    className="mr-2"
                  />
                  <label htmlFor={`member-${user._id}`} className="flex items-center">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      ({user.team})
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}
          {errors.members && <p className="text-red-500 text-xs mt-1">{errors.members}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={allMembers.loading}
          >
            {teamsLoading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewTeamMember;