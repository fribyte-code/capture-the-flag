import Layout from "./layout";
import { useLeaderboard } from "../hooks/useLeaderboard";

export default function Leaderboard() {
  // We need to move useLeaderboard one level up if we want to show teamScore on all pages
  // And potentially push toast messages on every task solved by your team
  const { leaderboard, isLoading } = useLeaderboard();

  return (
    <Layout>
      <div className="w-screen flex flex-col align-center">
        <h1 className="self-center font-bold">Live leaderboard</h1>
        {isLoading ? (
          <p>Loading</p>
        ) : (
          <table className="table table-zebra table-auto">
            <thead>
              <tr>
                <th>TeamName</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((l) => (
                <tr key={l.teamId} className="hover">
                  <td>{l.teamId}</td>
                  <td>{l.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
