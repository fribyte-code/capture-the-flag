import { useEffect, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import TaskComponent from "../components/taskComponent";
import { CtfTaskReadModel } from "../api/backendSchemas";

export default function Tasks() {
  const { data, isLoading, error } = useTasks({});

  const [filteredTasks, setFilteredTasks] = useState<
    CtfTaskReadModel[] | undefined
  >(undefined);
  const [showSolvedTasks, setShowSolvedTasks] = useState(true);

  useEffect(() => {
    setFilteredTasks(
      data?.filter((t) => (!showSolvedTasks ? !t.isSolved : true)),
    );
  }, [data, showSolvedTasks]);

  return (
    <Layout>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        filteredTasks && (
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
                {filteredTasks.map((task) => (
                  <TaskComponent task={task} key={task.id} />
                ))}
              </div>
            </div>
          </>
        )
      )}
    </Layout>
  );
}
