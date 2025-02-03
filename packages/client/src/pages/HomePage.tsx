import { Match, Switch } from "solid-js";
import { userStore } from "../stores/userStore";
import { A } from "@solidjs/router";

export const HomePage = () => {
  const [user] = userStore;

  return (
    <div>
      <h1>Welcome to Pandemonium</h1>
      <p>A game about myths and legends</p>
      <Switch>
        <Match when={user()}>
          <div>
            <h2>Logged in as {user()?.name}</h2>
            <p>Go to Games</p>
            <A href="/games">Games</A>
            <p>Click the button below to start a new game</p>
            <button>Start Game</button>
          </div>
        </Match>
        <Match when={!user}>
          <div>
            <h2>Log in to start playing</h2>
            <button>Log in</button>
          </div>
        </Match>
      </Switch>
    </div>
  );
};
