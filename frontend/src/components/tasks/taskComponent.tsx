import React, { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { fetchSolve } from "../../api/backendComponents";
import { CtfTaskReadModel } from "../../api/backendSchemas";
import style from "./taskComponent.module.css";
import classNames from "classnames";
import Modal from "../common/modal";
import TaskSolvedByList from "./taskSolvedBy";

export interface TaskComponentProps {
  task: CtfTaskReadModel;
}

const TaskComponent: React.FC<TaskComponentProps> = (props) => {
  const [solveTaskFeedback, setSolveTaskFeedback] = useState("");
  const [showSolvedByList, setShowSolvedByList] = useState(false);

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
    <>
      <details className={style.container}>
        <summary className={style.taskHeading}>
          <h3>
            {props.task.isSolved && <span>✅</span>} {props.task.name}
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
          <div className={style.solveFormContainer}>
            {props.task.isSolved ? (
              <p>Solved</p>
            ) : (
              <div>
                <form onSubmit={handleSolveTask} className={style.submitForm}>
                  <input
                    className="input filled"
                    type="text"
                    name="flag"
                    placeholder="Flag{the-flag}"
                  />
                  <input type="submit" value="Solve" className="button solid" />
                </form>
                {solveTaskFeedback ? <p>{solveTaskFeedback}</p> : ""}
              </div>
            )}
            <button
              className={classNames(style.solvedByText, "button")}
              onClick={() => setShowSolvedByList(true)}
            >
              Solved by {props.task.solvedCount} teams
            </button>
          </div>
        </div>
      </details>
      <Modal open={showSolvedByList} onClose={() => setShowSolvedByList(false)}>
        <TaskSolvedByList taskId={props.task.id || ""} />
      </Modal>
    </>
  );
};

export default TaskComponent;
