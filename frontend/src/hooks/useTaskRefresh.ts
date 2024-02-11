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
  // We would benefit from converting this to a singleton
  // to avoid multiple signalR subscriptions if hook is used multiple places.
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

  signalRSocket.subscribeToEvent(SignalRSocketEvent.reconnect, () => {
    // To ensure we do not lose any events; always re-download data
    // from api after signalR disconnect
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
