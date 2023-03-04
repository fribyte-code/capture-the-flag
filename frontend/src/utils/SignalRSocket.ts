import * as signalR from "@microsoft/signalr";

const instances: { [hubUrl: string]: SignalRSocketHandler } = {};

/**
 * Generic singleton SignalR class that support connecting to multiple different SignalR hubs.
 * @example
 * const signalRSocket = new SignalRSocketHandler("/signalr");
 * signalRSocket.subscribeToEvent(SignalRSocketEvent.reconnect, () => {
 *     // Redownload data from api as we have been disconnected
 * });
 * signalRSocket.on("ReceiveSolvedTask", (data) => {
 *     const solvedTask = data as SolvedTaskReadModel;
 *     console.debug("Someone solved a task", solvedTask);
 * });
 * signalRSocket.on("ReceiveLeaderboardEntryChange", (data) => {
 *     const leaderBoardEntry = data as LeaderboardEntry;
 *     console.debug("Leaderboard changed", leaderBoardEntry);
 * });
 */
export class SignalRSocketHandler {
  socket: signalR.HubConnection | undefined;
  status: SignalRSocketStatus = {
    connected: false,
    hasBeenConnectedPreviously: false,
    error: false,
    message: "",
  };
  /**
   * Uses a pub-sub mechanism to keep track of which
   * javascript functions are subscribed to a signalR change.
   * For example a user of this class might be subscribed to ""
   */
  subscribers: { [key: string]: Array<([arg0]: any) => void> } = {};

  constructor(url?: string) {
    if (url && !instances[url]) {
      console.debug("SignalR attempt to connect url: ", url);
      this.socket = new signalR.HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds() {
            // This will attempt reconnect forever every 5s
            return 5_000;
          },
        })
        .build();
      instances[url] = this; // Avoid creating a new connection to same url when already exists
      this.connect();
      this.socket.onclose(async (error) => {
        if (error) {
          console.error(error);
        }
        console.error("SignalR connection closed, trying to reconnect.");
        this.status.connected = false;
        this.signalStatusChange();
      });
      this.socket.onreconnecting(() => {
        console.error("Disconnected from signalR, trying to reconnect.");
      });
    } else if (!url) {
      throw new Error("First instantiation need to define url to signalR hub");
    }

    return instances[url];
  }

  /**
   * Connect to signalR hub
   */
  async connect() {
    if (!this.status.connected) {
      try {
        console.log("creating a new socket connection");
        await this.socket?.start();
        console.log("Connected to signalR hub");
        this.status.connected = true;
        this.status.error = false;
        this.status.message = "";

        if (this.status.hasBeenConnectedPreviously) {
          // This is a reconnection => we should therefor reload all application data
          this.notifySubsribers(SignalRSocketEvent.reconnect);
        }
        this.status.hasBeenConnectedPreviously = true;
        this.signalStatusChange();
      } catch (error) {
        console.error(error);

        this.status.error = true;
        this.status.message =
          error instanceof Error ? error.message : JSON.stringify(error);
        this.status.connected = false;
        this.signalStatusChange();

        setTimeout(() => {
          this.connect();
        }, 10000);
      }
    }
  }

  /**
   * Assign a signalR hub listener.
   * This method is called whenever the backend sends a message to this client.
   * @example signalRClient.on('ReceiveSolvedTask', (solvedTask) => {console.debug(solvedTask)});
   */
  on(methodName: string, cb: (...args: unknown[]) => void) {
    this.socket?.on(methodName, cb);
  }

  signalStatusChange() {
    this.notifySubsribers(SignalRSocketEvent.statuschange, this.status);
  }

  /**
   * Invoke method on backend server hub
   * @example signalRClient.invoke('SubscribeToLeaderboard');
   */
  invoke(topic: string, payload?: unknown) {
    if (payload) {
      this.socket?.invoke(topic, payload);
    } else {
      this.socket?.invoke(topic);
    }
  }

  /**
   * Disconnect signalR hub
   */
  async disconnect() {
    console.log("Stopping SignalR connection.");
    await this.socket?.stop();
    this.status.connected = false;
  }

  /**
   * Pub-sub mechanism for notifying users of this class that something
   * happened with the signalR connection.
   * Typically you would like to redownload leaderboard if connection is broken
   * as we could potentially miss data.
   * @param topic
   * @param cb
   */
  subscribeToEvent(
    topic: SignalRSocketEvent,
    cb: (newStatus: SignalRSocketStatus) => void
  ) {
    if (
      Object.prototype.hasOwnProperty.call(this.subscribers, topic) &&
      Array.isArray(this.subscribers[topic])
    ) {
      this.subscribers[topic].push(cb);
    } else {
      this.subscribers[topic] = [cb];
    }
  }

  unsubscribeToEvent(
    topic: SignalRSocketEvent,
    cb?: (newStatus: SignalRSocketStatus) => void
  ) {
    if (
      cb &&
      Object.prototype.hasOwnProperty.call(this.subscribers, topic) &&
      Array.isArray(this.subscribers[topic])
    ) {
      this.subscribers[topic] = this.subscribers[topic].filter(
        (fn) => fn != cb
      );
    } else {
      delete this.subscribers[topic];
    }
  }

  /**
   * Notify subscribers of this class that something happened, forexample signalR reconnect
   * @param topic what event has occured
   * @param payload potentially some data
   */
  notifySubsribers(topic: SignalRSocketEvent, payload?: unknown) {
    const subscribers = this.subscribers[topic];
    if (subscribers) {
      subscribers.forEach((fn) => {
        fn(payload);
      });
    }
  }
}

export interface SignalRSocketStatus {
  hasBeenConnectedPreviously: boolean;
  connected: boolean;
  error: boolean;
  message: string;
}

export enum SignalRSocketEvent {
  reconnect,
  statuschange,
}
