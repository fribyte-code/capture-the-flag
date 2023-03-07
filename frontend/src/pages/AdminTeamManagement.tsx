import Layout from "./layout";
import { fetchAddTeam, useAllTeams } from "../api/backendComponents";
import { useState } from "react";

export default function AdminTeamManagement() {
  const { data: teams, isLoading, refetch } = useAllTeams({});
  const [showPassword, setShowPassword] = useState(false);
  const [newTeams, setNewTeams] = useState("");

  async function handleAddNewTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    newTeams.split("\n").forEach(async (teamName) => {
      if (teamName) {
        await fetchAddTeam({
          body: {
            username: teamName,
          },
        });
      }
    });

    await refetch();
  }

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div>
          <form
            className="bg-white shadow-md rounded mb-2"
            onSubmit={handleAddNewTeam}
          >
            <p>Add new team</p>
            <textarea
              value={newTeams}
              onChange={(e) => setNewTeams(e.target.value)}
              name="usernames"
              placeholder="Usernames, one per line"
              className="shadow border rounded"
              rows={15}
              cols={20}
            />
            <input type="submit" className="shadow border rounded" />
          </form>
          <button
            onClick={(e) => setShowPassword(!showPassword)}
            className="rounded shaded border"
          >
            Toggle Show password
          </button>
          <table className="table-auto">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {teams?.map((t) => (
                <tr key={t.id}>
                  <td>{t.userName}</td>
                  <td>{showPassword ? t.teamPassword : "***"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
