import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/backendComponents";
import { LeaderboardEntry } from "../api/backendSchemas";
import {
  SignalRSocketEvent,
  SignalRSocketHandler,
} from "../utils/SignalRSocket";
import config from "../config";

export function useLeaderboard() {
  // We would benefit from converting this to a singleton
  // to avoid multiple signalR subscriptions if hook is used multiple places.
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastTaskSolveDate, setLastTaskSolveDate] = useState<null | Date>(null);

  useEffect(() => {
    fetchLeaderboardFromApi();
  }, []);

  const apiUrl = config.APP_API_URL ?? "";
  const signalRUrl = apiUrl + "/Api/signalr";
  const signalRSocket = new SignalRSocketHandler(signalRUrl);

  signalRSocket.subscribeToEvent(SignalRSocketEvent.reconnect, () => {
    // To ensure we do not lose any events; always re-download data
    // from api after signalR disconnect
    console.debug("Reconnected");
    fetchLeaderboardFromApi();
  });

  signalRSocket.on("ReceiveLeaderboardEntryChange", (data) => {
    const leaderBoardEntry = data as LeaderboardEntry;
    console.debug("Leaderboard changed", leaderBoardEntry);

    // Arrays in react state should be treated as read-only in order to ensure reactivity
    let existedInLeaderboard = false;
    const newLeaderboard = leaderboard.map((l) => {
      if (l.teamId == leaderBoardEntry.teamId) {
        existedInLeaderboard = true;
        return leaderBoardEntry;
      }
      return l;
    });
    if (!existedInLeaderboard) {
      newLeaderboard.push(leaderBoardEntry);
    }
    newLeaderboard.sort((a, b) => b.points! - a.points!);
    setLeaderboard(newLeaderboard);
    setLastTaskSolveDate(new Date());
  });

  async function fetchLeaderboardFromApi() {
    const leaderboardFromApi = await fetchLeaderboard({});

    setLeaderboard(leaderboardFromApi);
    setIsLoading(false);
  }

  return { leaderboard, isLoading, lastTaskSolveDate };
}
