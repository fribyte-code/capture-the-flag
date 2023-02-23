import React from "react";
import { CtfTaskReadModel } from "../api/backendSchemas";

export interface TaskComponentProps {
  task: CtfTaskReadModel;
}

const TaskComponent: React.FC<TaskComponentProps> = (props) => {
  return <div>{JSON.stringify(props.task)}</div>;
};

export default TaskComponent;
