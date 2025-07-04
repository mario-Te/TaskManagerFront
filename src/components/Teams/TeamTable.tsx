import React, { useState } from "react";
import { selectTeamsError, selectTeamsLoading, Team } from "../../redux/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { updateTeam, deleteTeam, setCurrentTeam, selectCurrentTeam } from "../../redux/teamSlice";

interface TeamTableProps {
  teams: Team[];
}

const TeamTable: React.FC<TeamTableProps> = ({ teams }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTeam = useSelector(selectCurrentTeam);
  const [editForm, setEditForm] = useState<Partial<Team>>({});
  const loading = useSelector(selectTeamsLoading);
  const error = useSelector(selectTeamsError);

  const handleEdit = (team: Team) => {
    dispatch(setCurrentTeam(team));
    setEditForm({
      name: team.name,
      description: team.description
    });
  };

  const handleCancel = () => {
    dispatch(setCurrentTeam(null));
  };

  const handleUpdate = async () => {
    if (currentTeam?._id) {
      await dispatch(updateTeam({
        id: currentTeam._id,
        teamData: editForm
      }));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      await dispatch(deleteTeam(id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading && teams.length === 0) {
    return <div className="text-center py-4">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 border text-left">Team Name</th>
            <th className="py-3 px-4 border text-left">Description</th>
            <th className="py-3 px-4 border text-left">Members</th>
            <th className="py-3 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team._id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border">
                {currentTeam?._id === team._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                  />
                ) : (
                  team.name
                )}
              </td>
              <td className="py-3 px-4 border">
                {currentTeam?._id === team._id ? (
                  <textarea
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={2}
                    disabled={loading}
                  />
                ) : (
                  team.description || <span className="text-gray-400">No description</span>
                )}
              </td>
              <td className="py-3 px-4 border">
                {team.members?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {team.members.map((member) => (
                      <span 
                        key={member._id} 
                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">No members</span>
                )}
              </td>
              <td className="py-3 px-4 border">
                {currentTeam?._id === team._id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className={`px-3 py-1 rounded ${loading ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team._id!)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;