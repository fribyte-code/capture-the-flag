import { useGetTeamsSolvedByTask } from "../../api/backendComponents";
import style from "./taskSolvedBy.module.css";

interface TaskSolvedByList {
  taskId: string;
}
export default function TaskSolvedByList({ taskId }: TaskSolvedByList) {
  const { isLoading, data } = useGetTeamsSolvedByTask({
    queryParams: { id: taskId },
  });

  if (isLoading) {
    return <p>Loading</p>;
  }
  return (
    <div className={style.container}>
      {!!data?.length && (
        <>
          <h2>Solved by</h2>
          <ol>{data?.map((team) => <li>{team}</li>)}</ol>
        </>
      )}
      {!!data?.length || <p>No one have solved this task yet!</p>}
    </div>
  );
}
