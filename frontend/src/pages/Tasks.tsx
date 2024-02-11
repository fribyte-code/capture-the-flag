import { useEffect, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import { CtfTaskReadModel } from "../api/backendSchemas";
import { useFirstBloodNotification } from "../hooks/useFirstBloodNotification";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskGroupComponent from "../components/taskGroupComponent";
import { useTasksWithRefresh } from "../hooks/useTaskRefresh";

type GroupedTasks = {
  [categoryName: string]: CtfTaskReadModel[];
};

export default function Tasks() {
  const { data, isLoading, error } = useTasksWithRefresh();
  const firstBloodNotification = useFirstBloodNotification();

  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});
  const [showSolvedTasks, setShowSolvedTasks] = useState(true);

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }

    const filteredTasks = data?.filter((t) =>
      !showSolvedTasks ? !t.isSolved : true,
    );

    setGroupedTasks(() => {
      let groupedTasks: GroupedTasks = {};
      filteredTasks?.forEach((task) => {
        let categoryTitle = task.category ?? "Other";
        if (!groupedTasks[categoryTitle]) {
          groupedTasks[categoryTitle] = [];
        }
        groupedTasks[categoryTitle].push(task);
      });
      return groupedTasks;
    });
  }, [data, error, showSolvedTasks]);

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
        groupedTasks && (
          <>
            <div className="form-control w-52">
              <label className="label cursor-pointer">
                <span className="label-text">Show solved tasks</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={showSolvedTasks}
                  onChange={(e) => setShowSolvedTasks(!showSolvedTasks)}
                />
              </label>
            </div>
            <div className="container mb-24">
              <h1 className="font-bold">Tasks</h1>
              <div className="flex flex-col gap-1">
                {Object.entries(groupedTasks).map(
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
