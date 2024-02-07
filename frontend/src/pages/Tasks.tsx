import { useEffect, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import { CtfTaskReadModel } from "../api/backendSchemas";
import TaskGroupComponent from "../components/taskGroupComponent";

type GroupedTasks = {
  [categoryName: string]: CtfTaskReadModel[];
};

export default function Tasks() {
  const { data, isLoading, error } = useTasks({});

  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});
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
      let groupedTasks: GroupedTasks = {};
      filteredTasks?.forEach((task) => {
        let categoryTitle = task.category ?? "Other";
        if (!groupedTasks[categoryTitle]) {
          groupedTasks[categoryTitle] = [];
        }
        groupedTasks[categoryTitle].push(task);
      });
      return groupedTasks;
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
                {Object.entries(groupedTasks).map(
                  ([category, tasksInGroup]) => (
                    <TaskGroupComponent title={category} tasks={tasksInGroup} />
                  ),
                )}
              </div>
            </div>
          </>
        )
      )}
    </Layout>
  );
}
