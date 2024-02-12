import { useEffect, useMemo, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import { CtfTaskReadModel } from "../api/backendSchemas";
import "react-toastify/dist/ReactToastify.css";
import TaskGroupComponent from "../components/tasks/taskGroupComponent";
import Toggle from "../components/toggle";
import style from "./tasks.module.css";
import GroupList from "../components/tasks/groupList";
import { useTaskRefresher } from "../hooks/useTaskRefresh";

export type GroupedTasks = Record<string, CtfTaskReadModel[]>;

export default function Tasks() {
  const { data, isLoading, error, refetch } = useTasks({});
  const { refresh, setRefresh } = useTaskRefresher();

  const [showSolvedTasks, setShowSolvedTasks] = useState(true);
  const [currentGroup, setCurrentGroup] = useState<keyof GroupedTasks | null>(
    null,
  );

  //Refetch on websocket signal
  useEffect(() => {
    const refetchAndSet = async () => {
      await refetch();
      setRefresh(false);
    };
    refetchAndSet();
  }, [refresh]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const filteredTaskGroups = useMemo(() => {
    let groupedTasks: GroupedTasks = {};
    for (const task of data || []) {
      let categoryTitle = task.category ?? "Other";
      if (!groupedTasks[categoryTitle]) {
        groupedTasks[categoryTitle] = [];
      }
      if (showSolvedTasks || (!showSolvedTasks && !task.isSolved)) {
        groupedTasks[categoryTitle].push(task);
      }
    }
    return groupedTasks;
  }, [data, showSolvedTasks]);

  const handleGroupChange = (group: keyof GroupedTasks) =>
    setCurrentGroup(group);

  return (
    <Layout>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        filteredTaskGroups && (
          <>
            <div>
              <label className={style.showSolvedLabel}>
                <span>Show solved tasks</span>
                <Toggle
                  checked={showSolvedTasks}
                  onChange={() => setShowSolvedTasks(!showSolvedTasks)}
                />
              </label>
            </div>
            <div className={style.tasksContainer}>
              <h1>Tasks</h1>
              <GroupList
                onChange={handleGroupChange}
                groups={Object.keys(filteredTaskGroups)}
              />
              {(currentGroup && filteredTaskGroups?.[currentGroup]?.length && (
                <TaskGroupComponent
                  title={currentGroup}
                  tasks={filteredTaskGroups[currentGroup]}
                />
              )) || <p>No tasks.</p>}
            </div>
          </>
        )
      )}
    </Layout>
  );
}
