import { useContext, useEffect, useState } from "react";

import {
  SignalRSocketEvent,
  SignalRSocketHandler,
} from "../utils/SignalRSocket";
import config from "../config";
import { ToastContext } from "../App";

//Remember to listen for changes on refresh and trigger refetch manually
export function useTaskRefresher() {
  const [refresh, setRefresh] = useState<Date>(new Date());
  const { toast } = useContext(ToastContext);
  const apiUrl = config.APP_API_URL ?? "";
  const signalRUrl = apiUrl + "/Api/signalr";
  const signalRSocket = new SignalRSocketHandler(signalRUrl);

  useEffect(() => {
    signalRSocket.subscribeToEvent(SignalRSocketEvent.reconnect, (data) => {
      console.debug("Reconnected");
      setRefresh(new Date());
    });

    signalRSocket.on("SignalNewTaskRelease", () => {
      setRefresh(new Date());
      toast(<p>New tasks have been released!</p>);
    });
  }, []);

  return { refresh, setRefresh };
}
