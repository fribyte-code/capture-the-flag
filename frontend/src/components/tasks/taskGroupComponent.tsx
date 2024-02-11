import React from "react";
import { CtfTaskReadModel } from "../../api/backendSchemas";
import TaskComponent from "./taskComponent";
import style from "./taskGroup.module.scss";

export interface TaskGroupComponentProps {
  title: string;
  tasks: CtfTaskReadModel[];
}

const TaskGroupComponent: React.FC<TaskGroupComponentProps> = (props) => {
  return (
    <>
      {props.tasks.map((task) => (
        <div className={style.task} key={task.id}>
          <TaskComponent task={task} />
        </div>
      ))}
    </>
  );
};

export default TaskGroupComponent;
