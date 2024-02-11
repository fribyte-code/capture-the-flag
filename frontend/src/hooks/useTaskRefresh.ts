import { useEffect, useState } from "react";
import {
  TasksResponse,
  fetchLeaderboard,
  fetchTasks,
  useTasks,
} from "../api/backendComponents";
import { LeaderboardEntry } from "../api/backendSchemas";
import {
  SignalRSocketEvent,
  SignalRSocketHandler,
} from "../utils/SignalRSocket";
import config from "../config";

export function useTasksWithRefresh() {
  const { data, isLoading, error } = useTasks({});
  const [tasks, setTasks] = useState<TasksResponse>([]);

  useEffect(() => {
    if (!isLoading && data) {
      setTasks(data);
    }
  }, [data]);
  const apiUrl = config.APP_API_URL ?? "";
  const signalRUrl = apiUrl + "/Api/signalr";
  const signalRSocket = new SignalRSocketHandler(signalRUrl);

  signalRSocket.subscribeToEvent(SignalRSocketEvent.reconnect, (data) => {
    refetchTasks();
    console.debug("Reconnected");
  });

  signalRSocket.on("SignalNewTaskRelease", () => {
    refetchTasks();
  });

  async function refetchTasks() {
    const newlyFetchedTasks = await fetchTasks({});
    setTasks(newlyFetchedTasks);
  }

  return { data: tasks, isLoading, error };
}
