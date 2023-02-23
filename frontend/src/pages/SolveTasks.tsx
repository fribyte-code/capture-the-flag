import { useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import TaskComponent from "../components/taskComponent";
import TaskSelector from "../components/taskSelector";

export default function SolveTasks() {
  const { data, isLoading, error } = useTasks({});
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
          <button onClick={() => safeSetTaskIx(taskIx - 1)}>{"<-"}</button>
          <TaskComponent task={data[taskIx]} />
          <button onClick={() => safeSetTaskIx(taskIx + 1)}>{"->"}</button>
          <br />
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
