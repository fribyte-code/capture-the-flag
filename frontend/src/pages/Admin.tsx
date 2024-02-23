import Layout from "./layout";
import {
  AdminAllTasksResponse,
  fetchAdminAddTask,
  useAdminAllCategories,
  useAdminAllTasks,
} from "../api/backendComponents";
import { ReactNode, useEffect, useState } from "react";
import { CtfTask, CtfTaskWriteModel } from "../api/backendSchemas";
import { useNavigate } from "react-router-dom";
import AdminTask from "../components/adminTask";
import DateSelector from "../components/dateSelector";
import style from "./Admin.module.css";
import FirstBloodVideo from "../components/heltsikkerComponents/firstBloodVideo";
export default function Admin() {
  const navigate = useNavigate();
  const {
    data: tasks,
    isLoading,
    refetch: refetchAllTasks,
    error,
  } = useAdminAllTasks({});
  const { data: allTaskCategories, refetch: refetchCategories } =
    useAdminAllCategories({});
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

    await refetchAllTasks();
    await refetchCategories();
  }

  const [currentEditingTask, setCurrentEditingTask] = useState<CtfTask | null>(
    null,
  );

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
    await refetchAllTasks();
    await refetchCategories();
  }
  (window as any).batchImportTasks = batchImportTasks;

  // This is to test volume and stuff of the video for the large display they plan to use :)
  const [showFirstBloodVideoTest, setShowFirstBloodVideoTest] =
    useState<ReactNode | null>(null);
  return (
    <Layout>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div style={{ maxWidth: "1200px" }}>
          <h1 style={{ marginBottom: "0" }}>Task management</h1>

          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/teams");
            }}
            className="button solid"
          >
            Team management
          </button>

          <form onSubmit={handleAddTask}>
            <h2>Add new task</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Task Name</span>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="input"
                defaultValue=""
                onChange={(e) => {
                  setNewTask({ ...newTask, category: e.target.value });
                }}
              >
                <option value="">Select category</option>;
                {allTaskCategories?.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <input
                value={newTask.category || undefined}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                type="text"
                name="category"
                placeholder="New category"
                className="input input-bordered"
              />
            </div>
            <br />
            <input type="submit" className="button solid" value="Create task" />
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
          <table className={style.adminTable}>
            <thead>
              <tr>
                <th role="button" onClick={(e) => handleClickSortProp("name")}>
                  Name
                </th>
                <th
                  role="button"
                  onClick={(e) => handleClickSortProp("category")}
                >
                  Category
                </th>
                <th
                  role="button"
                  onClick={(e) => handleClickSortProp("points")}
                >
                  Points
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {error
                ? `${error.status} ${error.payload}`
                : sortedTasks
                  ? sortedTasks.map((t) => (
                      <tr>
                        <td>{t.name}</td>
                        <td>{t.category ?? "Other"}</td>
                        <td>{t.points}</td>
                        <td>
                          <button
                            className="button solid"
                            onClick={() => {
                              setCurrentEditingTask(t);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  : ""}
            </tbody>
          </table>
          {currentEditingTask && (
            <AdminTask
              task={currentEditingTask}
              showFlag={true}
              onClose={() => setCurrentEditingTask(null)}
            />
          )}

          <h2 style={{ marginBottom: "1" }}>Test the First Blood Video:</h2>
          <button
            className="button solid"
            onClick={() =>
              setShowFirstBloodVideoTest(
                <FirstBloodVideo
                  teamId="SOME_NAME_that-is-super-long"
                  taskName="Open Source Intelligence - The GameBoy Treasure Hunt"
                  onClose={() => setShowFirstBloodVideoTest(null)}
                />,
              )
            }
          >
            Test First Blood!
          </button>
          {showFirstBloodVideoTest}
        </div>
      )}
    </Layout>
  );
}
