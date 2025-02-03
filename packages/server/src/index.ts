import express, { Request } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import authRouter from "./routes/auth";
import { JWT_SECRET, PORT } from "./env";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { User } from "../../shared/src";

const jwtDecodeOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  issuer: "accounts.pandemonium.com",
  audience: "pandemonium.com",
};

passport.use(
  new JwtStrategy(jwtDecodeOptions, (payload, done) => {
    return done(null, payload.data);
  })
);

const app = express();

const server = createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter);

const io = new Server(server, {
  serveClient: false,
  path: "/socket.io",
});

io.engine.use(
  (req: { _query: Record<string, string> }, res: Response, next: Function) => {
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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
