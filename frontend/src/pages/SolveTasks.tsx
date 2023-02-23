import { useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import TaskComponent from "../components/taskComponent";
import TaskSelector from "../components/taskSelector";

export default function SolveTasks() {
  // const { data, isLoading, error } = useTasks({});
  const data = [
    {
      id: "2b7ca9da-5701-44b1-acc6-aacb68b970ea",
      name: "Hello",
      points: 0,
      description: "",
    },
    {
      id: "a8f98cc7-36d5-4e33-b75a-7215a48add1e",
      name: "Shalom",
      points: 0,
      description: "Empty",
    },
  ];

  const [taskIx, setTaskIx] = useState(0);
  const taskCount = data?.length;

  function safeSetTaskIx(ix: number) {
    if (ix < 0 || taskCount == undefined) {
      setTaskIx(0);
    } else if (ix >= taskCount) {
      setTaskIx(taskCount - 1);
    } else {
      setTaskIx(ix);
    }
  }

  return (
    <Layout>
      {data != undefined && taskCount != undefined && taskCount != 0 && (
        <>
          <div className="container">
            <div className="grid grid-cols-3">
              <button onClick={() => safeSetTaskIx(taskIx - 1)}>&larr;</button>
              <TaskComponent task={data[taskIx]} />
              <button onClick={() => safeSetTaskIx(taskIx + 1)}>&rarr;</button>
            </div>
          </div>
          <TaskSelector
            currentIx={taskIx}
            taskCount={taskCount}
            updateIx={safeSetTaskIx}
          />
        </>
      )}
    </Layout>
  );
}
