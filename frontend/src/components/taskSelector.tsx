import React from "react";

export interface TaskSelectorProps {
  currentIx: number;
  taskCount: number;
  updateIx: (ix: number) => void;
}

// Denne skal gi oversikt over hvilken task du står på, og gå frem og tilbake - litt som eksamen..
const TaskSelector: React.FC<TaskSelectorProps> = (props) => {
  return (
    <div>
      {props.currentIx + 1} / {props.taskCount}
    </div>
  );
};

export default TaskSelector;
