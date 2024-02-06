import Layout from "./layout";
import {
  AdminAllTasksResponse,
  fetchAdminAddTask,
  useAdminAllTasks,
} from "../api/backendComponents";
import { useEffect, useState } from "react";
import { CtfTaskWriteModel } from "../api/backendSchemas";
import { useNavigate } from "react-router-dom";
import AdminTask from "../components/adminTask";
import DateSelector from "../components/DateSelector";
export default function Admin() {
  const navigate = useNavigate();
  const { data: tasks, isLoading, refetch, error } = useAdminAllTasks({});
  const [showFlag, setShowFlag] = useState(false);
  const [newTask, setNewTask] = useState<CtfTaskWriteModel>({
    name: "",
    points: 0,
    description: "",
    flag: "Flag{the-flag}",
    releaseDateTime: null,
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
            a[sortProp] > b[sortProp] ? (sortAsc ? 1 : -1) : sortAsc ? -1 : 1,
          )
        : [],
    );
  }, [tasks, sortProp, sortAsc]);

  /**
   * Hacky method for importing tasks from markdown format
   * @example batchImportTasks(`
   * # TaskA
   * some textA
   * ### Flag{Flag2}
   *
   * =task=
   * # TaskB
   * some textB
   * ### Flag{Flag2}
   *
   * =task=
   * `)
   */
  async function batchImportTasks(tasksString: string) {
    let addedTasks = 0;
    const tasksAsString = tasksString.split("\n=task=\n");
    const newTasks: CtfTaskWriteModel[] = [];
    tasksAsString.forEach(async (taskString) => {
      if (taskString.trim()) {
        console.debug(taskString);
        const regexMatch =
          /# (?<name>.+)(?<description>(.|\n)*)^### (?<flag>.+)/gm;
        for (const match of taskString.matchAll(regexMatch)) {
          const t = {
            name: ((match.groups as any).name as string).trim(),
            description: ((match.groups as any).description as string).trim(),
            flag: ((match.groups as any).flag as string).trim(),
            points: 0,
          };
          console.debug(t);
          newTasks.push(t);
        }
      }
    });

    await Promise.all(
      newTasks.map(async (t) => {
        await fetchAdminAddTask({
          body: t,
        });
        addedTasks++;
      }),
    );

    console.debug(`Added ${addedTasks} tasks`);
    await refetch();
  }
  (window as any).batchImportTasks = batchImportTasks;

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
                <span className="label-text">
                  Description (Rendered as markdown)
                </span>
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
                <span className="label-text">
                  Release Date Time (Empty for release now)
                </span>
              </label>
              <DateSelector
                onChange={(value) => {
                  setNewTask({
                    ...newTask,
                    releaseDateTime: value.toISOString(),
                  });
                }}
                defaultDate={newTask.releaseDateTime}
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
                  onClick={(e) => handleClickSortProp("name")}
                >
                  Name
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("points")}
                >
                  Points
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("description")}
                >
                  Description
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("releaseTime")}
                >
                  Release Time
                </th>
                <th
                  className="cursor-pointer"
                  onClick={(e) => handleClickSortProp("flag")}
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
