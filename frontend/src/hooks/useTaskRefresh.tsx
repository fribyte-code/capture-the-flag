import { useContext, useEffect, useState } from "react";

import {
  SignalRSocketEvent,
  SignalRSocketHandler,
} from "../utils/SignalRSocket";
import config from "../config";
import { ToastContext } from "../App";

export function useTaskRefresher() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const { toast } = useContext(ToastContext);
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
      toast(<p>New tasks have been released!</p>);
    });
  }, []);

  return { refresh, setRefresh };
}
