import { Match, Switch } from "solid-js";
import "../App.css";
import { userStore } from "../stores/userStore";
import { socketStatus } from "../stores/SocketManager";

export const UserHomePage = () => {
  const [user] = userStore;

  return (
    <div>
      <Switch>
        <Match when={socketStatus() && socketStatus()?.connected}>
          <p>
            User {user()?.name} connected to server. Socket ID:{" "}
            {socketStatus()?.id}
          </p>
        </Match>
        <Match when={socketStatus() && socketStatus()?.connected === false}>
          <p>Disconnected from server. Attempting to Reconnect...</p>
        </Match>
        <Match when={!socketStatus()}>
          <p>Connecting to server...</p>
        </Match>
      </Switch>
    </div>
  );
};
