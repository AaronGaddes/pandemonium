import express, { Request } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import authRouter from "./routes/auth";
import { JWT_SECRET, PORT } from "./env";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { User as GameUser } from "../../shared/src";
import { SocketManager } from "./managers/SocketManager";

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

SocketManager.init(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
