import { useEffect, useState } from "react";
import { useTasks } from "../api/backendComponents";
import Layout from "./layout";
import TaskComponent from "../components/taskComponent";
import { CtfTaskReadModel } from "../api/backendSchemas";
import { useFirstBloodNotification } from "../hooks/useFirstBloodNotification";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Tasks() {
  const { data, isLoading, error } = useTasks({});
  const firstBloodNotification = useFirstBloodNotification();

  const [filteredTasks, setFilteredTasks] = useState<
    CtfTaskReadModel[] | undefined
  >(undefined);
  const [showSolvedTasks, setShowSolvedTasks] = useState(true);

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }
    setFilteredTasks(
      data?.filter((t) => (!showSolvedTasks ? !t.isSolved : true)),
    );
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
        filteredTasks && (
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
                {filteredTasks.map((task) => (
                  <TaskComponent task={task} key={task.id} />
                ))}
              </div>
            </div>
          </>
        )
      )}
      <ToasterSection />
    </Layout>
  );
}
