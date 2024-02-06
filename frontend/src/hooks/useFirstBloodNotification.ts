import { useEffect, useState } from "react";
import { SignalRSocketHandler } from "../utils/SignalRSocket";
import { SolvedTaskReadModel } from "../api/backendSchemas";

export function useFirstBloodNotification() {
  const [firstBlood, setFirstBlood] = useState<SolvedTaskReadModel | null>(
    null,
  );

  useEffect(() => {
    const apiUrl = window.env?.APP_API_URL ?? "";
    const signalRUrl = apiUrl + "/Api/signalr";
    const signalRSocket = new SignalRSocketHandler(signalRUrl);

    signalRSocket.on("ReceiveFirstBloodNotification", (data) => {
      const solvedTask = data as SolvedTaskReadModel;
      console.debug("First blood!", solvedTask);
      setFirstBlood(solvedTask);
      console.debug("First blood event received!");
    });
  }, []);

  return firstBlood;
}
