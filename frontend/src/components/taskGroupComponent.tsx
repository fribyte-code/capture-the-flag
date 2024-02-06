import React from "react";
import { CtfTaskReadModel } from "../api/backendSchemas";
import TaskComponent from "./taskComponent";

export interface TaskGroupComponentProps {
  title: string;
  tasks: CtfTaskReadModel[];
}

const TaskGroupComponent: React.FC<TaskGroupComponentProps> = (props) => {
  return (
    <>
      <h2>Category: {props.title}</h2>
      {props.tasks.map((task) => (
        <TaskComponent task={task} key={task.id} />
      ))}
    </>
  );
};

export default TaskGroupComponent;
