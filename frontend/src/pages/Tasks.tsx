import { useEffect, useMemo, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import { CtfTaskReadModel } from "../api/backendSchemas";
import { useFirstBloodNotification } from "../hooks/useFirstBloodNotification";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskGroupComponent from "../components/tasks/taskGroupComponent";
import Toggle from "../components/toggle";
import style from "./tasks.module.css";
import GroupList from "../components/tasks/groupList";
import classNames from "classnames";

export type GroupedTasks = Record<string, CtfTaskReadModel[]>;

export default function Tasks() {
  const { data, isLoading, error } = useTasks({});
  const firstBloodNotification = useFirstBloodNotification();

  const [showSolvedTasks, setShowSolvedTasks] = useState(true);
  const [currentGroup, setCurrentGroup] = useState<keyof GroupedTasks | null>(
    null,
  );

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

  function ToasterSection() {
    useEffect(() => {
      if (firstBloodNotification && firstBloodNotification.task) {
        toast.success(
          `🩸First Blood: ${firstBloodNotification.task.name} solved by ${firstBloodNotification.teamId}🩸`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          },
        );
      }
    }, [firstBloodNotification]);

    return (
      <div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    );
  }

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
      <ToasterSection />
    </Layout>
  );
}
