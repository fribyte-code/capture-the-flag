import React from "react";

export interface TaskSelectorProps {
  currentIx: number;
  taskCount: number;
  updateIx: (ix: number) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = (props) => {
  return (
    <>
      {props.currentIx + 1}
      {props.taskCount}
    </>
  );
};

export default TaskSelector;
