import Layout from "./layout";
import {
  AdminAllTasksResponse,
  fetchAdminAddTask,
  fetchAdminDeleteTask,
  useAdminAllTasks,
} from "../api/backendComponents";
import { useEffect, useState } from "react";
import { CtfTaskWriteModel } from "../api/backendSchemas";
import { useNavigate } from "react-router-dom";
import AdminTask from "../components/adminTask";

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

  const [sortProp, setSortProp] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  function handleClickSortProp(prop: string) {
    setSortAsc(sortProp == prop ? !sortAsc : sortAsc);
    setSortProp(prop);
  }

  const [sortedTasks, setSortedTasks] = useState<
    AdminAllTasksResponse | undefined
  >();

  useEffect(() => {
    setSortedTasks(
      tasks
        ? [...tasks].sort((a: any, b: any) =>
            a[sortProp] > b[sortProp] ? (sortAsc ? 1 : -1) : sortAsc ? -1 : 1
          )
        : []
    );
  }, [tasks, sortProp, sortAsc]);

  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div style={{ maxWidth: "1200px" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/teams");
            }}
            className="btn btn-neutral"
          >
            Team management
          </a>
          <br />
          <br />
          <h1>Task management</h1>
          <br />
          <br />
          <form onSubmit={handleAddTask}>
            <h2>Add new task</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">TaskName</span>
              </label>
              <input
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                type="text"
                name="taskName"
                placeholder="Name"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Points</span>
              </label>
              <input
                value={newTask.points}
                onChange={(e) =>
                  setNewTask({ ...newTask, points: Number(e.target.value) })
                }
                type="number"
                name="points"
                placeholder="Points"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                name="Description"
                rows={6}
                cols={20}
                className="textarea textarea-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Flag</span>
              </label>
              <input
                value={newTask.flag}
                onChange={(e) =>
                  setNewTask({ ...newTask, flag: e.target.value })
                }
                type="text"
                name="flag"
                placeholder="Flag{the-flag}"
                className="input input-bordered"
              />
            </div>
            <input type="submit" className="btn btn-primary" />
            <br />
            <br />
          </form>
          <div className="form-control w-64">
            <label className="label cursor-pointer">
              <span className="label-text">Toggle Show flag</span>
              <input
                type="checkbox"
                className="toggle"
                checked={showFlag}
                onChange={(e) => setShowFlag(!showFlag)}
              />
            </label>
          </div>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("Name")}
                >
                  Name
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("Points")}
                >
                  Points
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("Description")}
                >
                  Description
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("Flag")}
                >
                  Flag
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {error
                ? `${error.status} ${error.payload}`
                : sortedTasks
                ? sortedTasks.map((t) => (
                    <AdminTask
                      showFlag={showFlag}
                      task={t}
                      key={t.id}
                    ></AdminTask>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
