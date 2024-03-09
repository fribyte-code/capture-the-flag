import { useEffect, useState } from "react";
import {
  fetchAdminDeleteTask,
  fetchAdminUpdateTask,
  useAdminAllCategories,
  useAdminAllTasks,
} from "../api/backendComponents";
import { CtfTask } from "../api/backendSchemas";
import DateSelector from "./dateSelector";
import style from "./adminTask.module.css";

export interface AdminTaskProps {
  task: CtfTask;
  showFlag: boolean;
}

const AdminTask: React.FC<AdminTaskProps> = (props) => {
  const { refetch: refetchTasks } = useAdminAllTasks({});
  const { data: allTaskCategories, refetch: refetchCategories } =
    useAdminAllCategories({});
  async function deleteTask() {
    if (updatedTask.id) {
      await fetchAdminDeleteTask({
        pathParams: {
          id: updatedTask.id,
        },
      });

      await refetchTasks();
      await refetchCategories();
    }
  }
  async function updateTask() {
    if (updatedTask.id) {
      await fetchAdminUpdateTask({
        pathParams: {
          id: updatedTask.id,
        },
        body: updatedTask,
      });

      await refetchTasks();
      await refetchCategories();
      setIsModified(false);
    }
  }
  const [updatedTask, setUpdatedtask] = useState(props.task);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setIsModified(JSON.stringify(props.task) !== JSON.stringify(updatedTask));
  }, [updatedTask]);

  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Task Name</span>
        </label>
        <input
          autoFocus
          type="text"
          value={updatedTask.name}
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              name: e.currentTarget.value,
            })
          }
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Points</span>
        </label>
        <input
          type="number"
          value={updatedTask.points}
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              points: Number(e.currentTarget.value),
            })
          }
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description (Rendered as markdown)</span>
        </label>
        <textarea
          cols={70}
          rows={10}
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              description: e.currentTarget.value,
            })
          }
          value={updatedTask.description}
        ></textarea>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Release Date Time (Empty for release now)
          </span>
        </label>
        <DateSelector
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              releaseDateTime: e.toISOString(),
            })
          }
          defaultDate={props.task.releaseDateTime}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Flag</span>
        </label>
        <input
          type="text"
          value={props.showFlag ? updatedTask.flag : "***"}
          disabled={!props.showFlag}
          onChange={(e) =>
            props.showFlag
              ? setUpdatedtask({
                  ...updatedTask,
                  flag: e.currentTarget.value,
                })
              : ""
          }
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Category</span>
        </label>
        <select
          className="input"
          defaultValue=""
          onChange={(e) => {
            setUpdatedtask({
              ...updatedTask,
              category: e.currentTarget.value,
            });
          }}
        >
          <option value="">Select category</option>;
          {allTaskCategories?.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New category"
          value={updatedTask.category ?? undefined}
          onChange={(e) => {
            setUpdatedtask({
              ...updatedTask,
              category: e.currentTarget.value,
            });
          }}
        />
      </div>
      <div className="form-control">
        <button className="button" onClick={deleteTask}>
          Delete
        </button>
        <br />
        <br />
        <button
          disabled={!isModified}
          className={`button ${isModified ? "solid" : ""}`}
          onClick={updateTask}
        >
          Update
        </button>
      </div>
    </>
  );
};

export default AdminTask;
