import Layout from "./layout";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Leaderboard() {
  // We need to move useLeaderboard one level up if we want to show teamScore on all pages
  // And potentially push toast messages on every task solved by your team
  const { leaderboard, isLoading, lastTaskSolveDate } = useLeaderboard();

  useEffect(() => {
    if (lastTaskSolveDate) {
      console.debug("Leaderboard change");
      confetti({
        particleCount: 75,
        spread: 50,
        origin: { y: 1 },
      });
    }
  }, [lastTaskSolveDate]);

  return (
    <Layout>
      <div className="flex flex-col align-center">
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
            <tbody aria-live="polite">
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
