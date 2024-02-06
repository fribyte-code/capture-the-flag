import { useEffect, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import { CtfTaskReadModel } from "../api/backendSchemas";
import TaskGroupComponent from "../components/taskGroupComponent";

export default function Tasks() {
  const { data, isLoading, error } = useTasks({});

  const [groupedTasks, setGroupedTasks] = useState<{
    [key: string]: CtfTaskReadModel[];
  }>({});
  const [showSolvedTasks, setShowSolvedTasks] = useState(true);

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }

    const filteredTasks = data?.filter((t) =>
      !showSolvedTasks ? !t.isSolved : true,
    );

    setGroupedTasks(() => {
      let temp: { [key: string]: CtfTaskReadModel[] } = {};
      filteredTasks?.forEach((task) => {
        let categoryTitle = task.category ?? "Other";
        if (!temp[categoryTitle]) {
          temp[categoryTitle] = [];
        }
        temp[categoryTitle].push(task);
      });
      return temp;
    });
  }, [data, error, showSolvedTasks]);

  return (
    <Layout>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        groupedTasks && (
          <>
            <div className="form-control w-52">
              <label className="label cursor-pointer">
                <span className="label-text">Show solved tasks</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={showSolvedTasks}
                  onChange={(e) => setShowSolvedTasks(!showSolvedTasks)}
                />
              </label>
            </div>
            <div className="container mb-24">
              <h1 className="font-bold">Tasks</h1>
              <div className="flex flex-col gap-1">
                {Object.entries(groupedTasks).map((category) => (
                  <TaskGroupComponent title={category[0]} tasks={category[1]} />
                ))}
              </div>
            </div>
          </>
        )
      )}
    </Layout>
  );
}
