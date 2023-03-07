import React, { FormEvent, useState } from "react";
import { fetchSolve } from "../api/backendComponents";
import { CtfTaskReadModel } from "../api/backendSchemas";

export interface TaskComponentProps {
  task: CtfTaskReadModel;
}

const TaskComponent: React.FC<TaskComponentProps> = (props) => {
  const [solveTaskFeedback, setSolveTaskFeedback] = useState("");
  async function handleSolveTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await fetchSolve({
      pathParams: { id: props.task.id! },
      body: { flag: e.currentTarget.flag.value },
    });

    if (result.success) {
      setSolveTaskFeedback("Correct!");
    } else if (result.isBruteForceDetected) {
      setSolveTaskFeedback(
        "Error when solving task, are you bruteforcing it? Wait 30 seconds."
      );
    } else {
      setSolveTaskFeedback("Wrong flag!");
    }
  }
  return (
    <div>
      <h1>{props.task.name}</h1>
      <p>
        <b>Description: </b>
        {props.task.description}
      </p>
      <p>
        <b>Points: </b>
        {props.task.points}
      </p>
      <form onSubmit={handleSolveTask}>
        <input
          type="text"
          name="flag"
          placeholder="Flag{the-flag}"
          className="shaded border"
        />
        <input type="submit" value="Solve" className="shaded border" />
      </form>
      {solveTaskFeedback ? <p>{solveTaskFeedback}</p> : ""}
    </div>
  );
};

export default TaskComponent;
