import { useEffect, useState } from "react";
import {
  fetchAdminDeleteTask,
  fetchAdminUpdateTask,
  useAdminAllCategories,
  useAdminAllTasks,
} from "../api/backendComponents";
import { CtfTask } from "../api/backendSchemas";
import DateSelector from "./dateSelector";

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
    <tr key={updatedTask.id} className="hover">
      <td>
        <input
          type="text"
          value={updatedTask.name}
          className="input input-bordered input-sm"
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              name: e.currentTarget.value,
            })
          }
        />
      </td>
      <td>
        <input
          type="number"
          value={updatedTask.points}
          className="input input-bordered input-sm w-20"
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              points: Number(e.currentTarget.value),
            })
          }
        />
      </td>
      <td>
        <textarea
          cols={70}
          rows={10}
          className="textarea textarea-bordered textarea-xs"
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              description: e.currentTarget.value,
            })
          }
          value={updatedTask.description}
        ></textarea>
      </td>
      <td>
        <DateSelector
          onChange={(e) =>
            setUpdatedtask({
              ...updatedTask,
              releaseDateTime: e.toISOString(),
            })
          }
          defaultDate={props.task.releaseDateTime}
        />
      </td>
      <td>
        <input
          type="text"
          value={props.showFlag ? updatedTask.flag : "***"}
          disabled={!props.showFlag}
          className="input input-bordered input-sm"
          onChange={(e) =>
            props.showFlag
              ? setUpdatedtask({
                  ...updatedTask,
                  flag: e.currentTarget.value,
                })
              : ""
          }
        />
      </td>
      <td>
        <select
          className="select select-bordered"
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
          className="input input-bordered input-sm"
          onChange={(e) => {
            setUpdatedtask({
              ...updatedTask,
              category: e.currentTarget.value,
            });
          }}
        />
      </td>
      <td>
        <button
          className="btn btn-error btn-outline btn-xs"
          onClick={deleteTask}
        >
          Delete
        </button>
        <br />
        <br />
        <button
          disabled={!isModified}
          className={`btn btn-warning ${
            isModified ? "" : "btn-outline"
          } btn-xs`}
          onClick={updateTask}
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default AdminTask;
