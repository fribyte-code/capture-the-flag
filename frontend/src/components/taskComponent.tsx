import React, { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { fetchSolve } from "../api/backendComponents";
import { CtfTaskReadModel } from "../api/backendSchemas";
import style from "./taskComponent.module.scss";

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
        "Error when solving task, are you bruteforcing it? Wait 30 seconds.",
      );
    } else {
      setSolveTaskFeedback("Wrong flag!");
    }
  }
  return (
    <details className={style.container}>
      <summary className={style.taskHeading}>
        <h3>
          {props.task.isSolved ? <span>✅</span> : <span>❌</span>} -{" "}
          {props.task.name}
          <span className={style.points}>{props.task.points} points</span>
        </h3>

        <span className={`${style.arrow} material-symbols-outlined`}>
          expand_more
        </span>
      </summary>
      <div className={style.content}>
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
          className="markdown mb-2"
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
          <form onSubmit={handleSolveTask} className={style.submitForm}>
            <input type="text" name="flag" placeholder="Flag{the-flag}" />
            <input type="submit" value="Solve" className="button solid" />
          </form>
        )}
        {solveTaskFeedback ? <p>{solveTaskFeedback}</p> : ""}
      </div>
    </details>
  );
};

export default TaskComponent;
