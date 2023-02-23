import React from "react";
import { CtfTaskReadModel } from "../api/backendSchemas";

export interface TaskComponentProps {
  task: CtfTaskReadModel;
}

const TaskComponent: React.FC<TaskComponentProps> = (props) => {
  return <>{JSON.stringify(props.task)}</>;
};

export default TaskComponent;
