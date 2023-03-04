import Layout from "./layout";
import { useAdminAllTasks } from "../api/backendComponents";
import { useState } from "react";

export default function Leaderboard() {
  const { data: tasks, isLoading } = useAdminAllTasks({});
  const [showFlag, setShowFlag] = useState(false);

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div>
          <button onClick={(e) => setShowFlag(!showFlag)}>
            Toggle Show flag
          </button>
          <table className="table-auto">
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Description</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.points}</td>
                  <td>{t.description}</td>
                  <td>{showFlag ? t.flag : "***"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
