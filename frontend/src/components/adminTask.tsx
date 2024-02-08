import { useEffect, useState } from "react";
import {
  fetchAdminDeleteTask,
  fetchAdminUpdateTask,
  useAdminAllCategories,
  useAdminAllTasks,
} from "../api/backendComponents";
import { CtfTask } from "../api/backendSchemas";

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
      </td>
      <td>
        <select
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
      </td>
      <td>
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
      </td>
    </tr>
  );
};

export default AdminTask;
