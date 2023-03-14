import Layout from "./layout";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function Leaderboard() {
  // We need to move useLeaderboard one level up if we want to show teamScore on all pages
  // And potentially push toast messages on every task solved by your team
  const { leaderboard, isLoading, lastTaskSolveDate } = useLeaderboard();
  const [podium, setPodium] = useState<
    {
      teamId?: string;
      points?: number;
      place: number;
      emoji: string;
    }[]
  >([]);

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

  useEffect(() => {
    setPodium([
      {
        teamId: leaderboard.at(2)?.teamId,
        points: leaderboard.at(2)?.points,
        place: 2,
        emoji: "🥉",
      },
      {
        teamId: leaderboard.at(0)?.teamId,
        points: leaderboard.at(0)?.points,
        place: 0,
        emoji: "🥇",
      },
      {
        teamId: leaderboard.at(1)?.teamId,
        points: leaderboard.at(1)?.points,
        place: 1,
        emoji: "🥈",
      },
    ]);
  }, [leaderboard]);

  return (
    <Layout>
      <div className="flex flex-col align-center">
        <h1 className="self-center font-bold text-xl">Live leaderboard</h1>
        <br />
        <div
          id="podium"
          className="flex flex-row gap-x-24 items-end self-center"
        >
          {podium.map((entry) => (
            <div className="flex flex-col items-center gap-y-1">
              <p className="text-xl items flex justify-center">
                {entry.emoji}
                {entry.teamId}
                {entry.emoji}
              </p>
              <div
                className="rounded bg-neutral px-12 flex items-center text-warning text-xl"
                style={{ height: `${48 * (3 - entry.place)}px` }}
              >
                {entry.points}
              </div>
            </div>
          ))}
        </div>
        <br />
        {isLoading ? (
          <p>Loading</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </Layout>
  );
}
