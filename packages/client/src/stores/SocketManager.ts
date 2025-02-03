import { io, Socket } from "socket.io-client";
import { createSignal } from "solid-js";

type SocketStatus = {
  connected: boolean;
  id?: string;
};
export const [socketStatus, setSocketStatus] = createSignal<SocketStatus>();

class SocketManager {
  private socket: Socket;

  constructor() {
    this.socket = io("", {
      autoConnect: false,
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
      setSocketStatus({ connected: true, id: this.socket.id });
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setSocketStatus({ connected: false });
    });
  }

  public connect(authToken: string) {
    this.socket.io.opts.extraHeaders = {
      authorization: `bearer ${authToken}`,
    };
    this.socket.connect();
  }

  public joinGame(gameId: string) {
    this.socket.emit("joinGame", gameId);
  }

  public getSocket() {
    return this.socket;
  }
}

export default new SocketManager();
