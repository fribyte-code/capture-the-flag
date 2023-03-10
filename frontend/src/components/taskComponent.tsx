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
        <span
          dangerouslySetInnerHTML={{ __html: props.task.description ?? "" }}
        ></span>
      </p>
      <p>
        <b>Points: </b>
        {props.task.points}
      </p>
      <form onSubmit={handleSolveTask}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Flag:</span>
          </label>
          <input
            type="text"
            name="flag"
            placeholder="Flag{the-flag}"
            className="input input-bordered"
          />
        </div>
        <input
          type="submit"
          value="Solve"
          className="btn btn-outline btn-primary"
        />
      </form>
      {solveTaskFeedback ? <p>{solveTaskFeedback}</p> : ""}
    </div>
  );
};

export default TaskComponent;
