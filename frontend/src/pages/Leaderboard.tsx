import Layout from "./layout";
import { useLeaderboard } from "../hooks/useLeaderboard";

export default function Leaderboard() {
  // We need to move useLeaderboard one level up if we want to show teamScore on all pages
  // And potentially push toast messages on every task solved by your team
  const { leaderboard, isLoading } = useLeaderboard();

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <table className="table-auto">
          <thead>
            <tr>
              <th>TeamId</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((l) => (
              <tr key={l.teamId}>
                <td>{l.teamId}</td>
                <td>{l.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
