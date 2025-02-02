import express from "express";
import { SharedType } from "../../shared/src/index";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  serveClient: false,
  path: "/socket.io",
});

app.get("/", (req, res) => {
  const blah: SharedType = {
    name: "blah blah blah",
    age: 42,
  };
  res.send(JSON.stringify(blah));
});

io.on("connection", (socket) => {
  console.log("a client connected, ID: ", socket.id);
});

server.listen(6969, () => {
  console.log("Server is running on http://localhost:6969");
});
