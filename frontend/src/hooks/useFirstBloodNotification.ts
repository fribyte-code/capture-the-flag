import { useEffect, useState } from "react";
import { SignalRSocketHandler } from "../utils/SignalRSocket";
import { SolvedTaskReadModel } from "../api/backendSchemas";
import config from "../config";

export function useFirstBloodNotification() {
  const [firstBlood, setFirstBlood] = useState<SolvedTaskReadModel | null>(
    null,
  );

  useEffect(() => {
    const apiUrl = config.APP_API_URL ?? "";
    const signalRUrl = apiUrl + "/Api/signalr";
    const signalRSocket = new SignalRSocketHandler(signalRUrl);

    signalRSocket.on("ReceiveFirstBloodNotification", (data) => {
      const solvedTask = data as SolvedTaskReadModel;
      setFirstBlood(solvedTask);
    });
  }, []);

  return firstBlood;
}
