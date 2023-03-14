import Layout from "./layout";
import { fetchAddTeam, useAllTeams } from "../api/backendComponents";
import { useState } from "react";

export default function AdminTeamManagement() {
  const { data: teams, isLoading, refetch } = useAllTeams({});
  const [showPassword, setShowPassword] = useState(false);
  const [newTeams, setNewTeams] = useState("");
  const [teamPasswordToShow, setTeamPasswordToShow] = useState("");

  async function handleAddNewTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await Promise.all(
      newTeams.split("\n").map(async (teamName) => {
        if (teamName) {
          await fetchAddTeam({
            body: {
              username: teamName,
            },
          });
        }
      })
    );

    await refetch();
  }

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div style={{ maxWidth: "1200px" }}>
          <form onSubmit={handleAddNewTeam}>
            <h2>Add new teams</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Team-names</span>
              </label>
              <textarea
                value={newTeams}
                onChange={(e) => setNewTeams(e.target.value)}
                name="usernames"
                placeholder="Usernames, one per line"
                className="textarea textarea-bordered"
                rows={8}
                cols={10}
              />
            </div>
            <input type="submit" className="btn btn-primary" />
          </form>
          <div className="form-control w-64">
            <label className="label cursor-pointer">
              <span className="label-text">Toggle Show password</span>
              <input
                type="checkbox"
                className="toggle"
                checked={showPassword}
                onClick={(e) => setShowPassword(!showPassword)}
              />
            </label>
          </div>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password (Click to show)</th>
              </tr>
            </thead>
            <tbody>
              {teams?.map((t) => (
                <tr key={t.id} className="hover">
                  <td>{t.userName}</td>
                  <td
                    className="cursor-pointer"
                    onClick={(e) =>
                      setTeamPasswordToShow(
                        teamPasswordToShow == t.userName ? "" : t.userName!
                      )
                    }
                  >
                    {teamPasswordToShow == t.userName || showPassword
                      ? t.teamPassword
                      : "***"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
