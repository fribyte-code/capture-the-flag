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
import { useQueryClient } from "@tanstack/react-query";

export function useTaskRefresher() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const apiUrl = config.APP_API_URL ?? "";
  const signalRUrl = apiUrl + "/Api/signalr";
  const signalRSocket = new SignalRSocketHandler(signalRUrl);

  useEffect(() => {
    signalRSocket.subscribeToEvent(SignalRSocketEvent.reconnect, (data) => {
      console.debug("Reconnected");
      setRefresh(true);
    });

    signalRSocket.on("SignalNewTaskRelease", () => {
      setRefresh(true);
    });
  }, []);

  return { refresh, setRefresh };
}
