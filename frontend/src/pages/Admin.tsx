import Layout from "./layout";
import { fetchAdminAddTask, useAdminAllTasks } from "../api/backendComponents";
import { useState } from "react";
import { CtfTaskWriteModel } from "../api/backendSchemas";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const { data: tasks, isLoading, refetch, error } = useAdminAllTasks({});
  const [showFlag, setShowFlag] = useState(false);
  const [newTask, setNewTask] = useState<CtfTaskWriteModel>({
    name: "",
    points: 0,
    description: "",
    flag: "Flag{the-flag}",
  });

  async function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetchAdminAddTask({
      body: newTask,
    });

    await refetch();
  }

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/teams");
            }}
            className="border shaded -m-1.5 p-1.5"
          >
            Team management
          </a>
          <br />
          <br />
          <form
            className="bg-white shadow-md rounded mb-2"
            onSubmit={handleAddTask}
          >
            <p>Add new task</p>
            <input
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              type="text"
              name="taskName"
              placeholder="Name"
              className="shadow border rounded"
            />
            <input
              value={newTask.points}
              onChange={(e) =>
                setNewTask({ ...newTask, points: Number(e.target.value) })
              }
              type="number"
              name="points"
              placeholder="Points"
              className="shadow border rounded"
            />
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              name="Description"
              rows={6}
              cols={20}
              className="shadow border rounded"
            />
            <input
              value={newTask.flag}
              onChange={(e) => setNewTask({ ...newTask, flag: e.target.value })}
              type="text"
              name="flag"
              placeholder="Flag{the-flag}"
              className="shadow border rounded"
            />
            <input type="submit" className="shadow border rounded" />
          </form>
          <button
            onClick={(e) => setShowFlag(!showFlag)}
            className="rounded shaded border"
          >
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
              {error
                ? `${error.status} ${error.payload}`
                : tasks
                ? tasks.map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.points}</td>
                      <td>{t.description}</td>
                      <td>{showFlag ? t.flag : "***"}</td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
