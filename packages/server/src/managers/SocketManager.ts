import { Request } from "express";
import { Server as HttpServer } from "node:http";
import passport from "passport";
import { Server } from "socket.io";
import { User } from "../../../shared/src";

export class SocketManager {
  io: Server;
  static init(server: HttpServer) {
    return new SocketManager(server);
  }
  constructor(server: HttpServer) {
    const io = new Server(server, {
      serveClient: false,
      path: "/socket.io",
    });

    io.engine.use(
      (
        req: { _query: Record<string, string> },
        res: Response,
        next: Function
      ) => {
        const isHandshake = req._query.sid === undefined;
        if (isHandshake) {
          passport.authenticate("jwt", { session: false })(req, res, next);
        } else {
          next();
        }
      }
    );

    io.on("connection", (socket) => {
      console.log("a client connected, ID: ", socket.id);
      const req = socket.request as Request & { user?: User };

      socket.on("joinGame", (gameId: string) => {
        socket.join(gameId);
      });

      socket.on("disconnect", () => {
        console.log("a client disconnected, ID: ", socket.id);
      });

      if (!req.user) {
        socket.disconnect();
        return;
      }

      socket.on("whoami", (callback) => {
        callback(req.user);
      });
    });
    this.io = io;
  }
}
