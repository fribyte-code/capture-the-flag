import Layout from "./layout";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import style from "./leaderboard.module.css";

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
      <div>
        <h1>Live leaderboard</h1>
        <br />
        <div className={style.podium}>
          {podium.map((entry, idx) => (
            <div className={style.podiumTeam} key={idx}>
              <p className={style.podiumTeamName}>
                {entry.emoji}
                {entry.teamId}
                {entry.emoji}
              </p>
              <div
                className={style.podiumStep}
                style={{ height: `${48 * (3 - entry.place)}px` }}
              >
                <span>{entry.points}</span>
              </div>
            </div>
          ))}
        </div>
        <br />
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
