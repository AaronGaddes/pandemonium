import { createSignal, Match, onMount, Switch } from "solid-js";
import { io, Socket } from "socket.io-client";
import { SharedType } from "../../shared/src/index";
import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = createSignal(0);
  const [socket, setSocket] = createSignal<Socket>();

  onMount(() => {
    const shared: SharedType = {
      name: "blah blah blah",
      age: 42,
    };
    const socket = io("");
    socket.on("connect", () => {
      console.log("Connected to server");
      setSocket(socket);
    });
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <Switch>
          <Match when={socket() && socket()?.connected}>
            <p>Connected to server. Socket ID: ${socket()?.id}</p>
          </Match>
          <Match when={socket() && socket()?.disconnected}>
            <p>Disconnected from server. Attempting to Reconnect...</p>
          </Match>
          <Match when={!socket()}>
            <p>Connecting to server...</p>
          </Match>
        </Switch>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  );
}

export default App;
