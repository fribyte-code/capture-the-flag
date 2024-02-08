import { useEffect, useMemo, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import { CtfTaskReadModel } from "../api/backendSchemas";
import { useFirstBloodNotification } from "../hooks/useFirstBloodNotification";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskGroupComponent from "../components/taskGroupComponent";
import Toggle from "../components/toggle";
import style from "./tasks.module.scss";

type GroupedTasks = {
  [categoryName: string]: CtfTaskReadModel[];
};

export default function Tasks() {
  const { data, isLoading, error } = useTasks({});
  const firstBloodNotification = useFirstBloodNotification();

  const [showSolvedTasks, setShowSolvedTasks] = useState(true);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const filteredTaskGroups = useMemo(() => {
    const tasks = data?.filter((t) => (!showSolvedTasks ? !t.isSolved : true));
    let groupedTasks: GroupedTasks = {};
    tasks?.forEach((task) => {
      let categoryTitle = task.category ?? "Other";
      if (!groupedTasks[categoryTitle]) {
        groupedTasks[categoryTitle] = [];
      }
      groupedTasks[categoryTitle].push(task);
    });
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
              <div className="flex flex-col gap-1">
                {Object.entries(filteredTaskGroups).map(
                  ([category, tasksInGroup]) => (
                    <TaskGroupComponent
                      title={category}
                      tasks={tasksInGroup}
                      key={category}
                    />
                  ),
                )}
              </div>
            </div>
          </>
        )
      )}
      <ToasterSection />
    </Layout>
  );
}
