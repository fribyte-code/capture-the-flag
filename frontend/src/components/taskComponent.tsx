import React, { FormEvent, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
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
    <div
      tabIndex={0}
      className="collapse border rounded-box border-base-300 bg-base-100 collapse-arrow"
    >
      <input type="checkbox" />
      <div className="collapse-title text-md font-medium">
        <h1>
          {props.task.isSolved ? <span>✅</span> : <span>❌</span>} -{" "}
          {props.task.name}
        </h1>
      </div>
      <div className="collapse-content">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
          linkTarget="_blank"
        >
          {props.task.description ?? ""}
        </ReactMarkdown>
        <p>
          <b>Points: </b>
          {props.task.points}
        </p>
        {props.task.isSolved ? (
          <p>Solved</p>
        ) : (
          <form
            onSubmit={handleSolveTask}
            className="flex flex-row items-center"
          >
            <input
              type="text"
              name="flag"
              placeholder="Flag{the-flag}"
              className="input input-bordered"
            />
            <input
              type="submit"
              value="Solve"
              className="btn btn-outline btn-primary"
            />
          </form>
        )}
        {solveTaskFeedback ? <p>{solveTaskFeedback}</p> : ""}
      </div>
    </div>
  );
};

export default TaskComponent;
