import { Component, createEffect, createResource } from "solid-js";
import "./App.css";
import { Route, Router, RouteSectionProps, useNavigate } from "@solidjs/router";
import { CreateUserPage } from "./pages/CreateUserPage";
import { GameList } from "./pages/GameList";
import { userStore } from "./stores/userStore";
import SocketManager from "./stores/SocketManager";
import { User } from "../../shared/src";
import { HomePage } from "./pages/HomePage";
import {
  LocalStorageProvider,
  useLocalStorage,
} from "./stores/LocalStorageContext";

const fetchSelf = async (authToken: string) => {
  const response = await fetch("/auth/self", {
    headers: {
      authorization: `bearer ${authToken}`,
    },
  });

  console.log("fetched self");

  if (!response.ok) {
    throw new Error("Failed to fetch self");
  }

  return response.json() as Promise<User>;
};

const Layout: Component<RouteSectionProps> = (props) => {
  const navigate = useNavigate();

  const [storage, { removeItem }] = useLocalStorage();

  const authToken = () => storage.authToken;

  const [user] = createResource(authToken, fetchSelf);

  const [_, setUserStoreData] = userStore;

  createEffect(() => {
    const currentAuthToken = authToken();
    if (user.loading) {
      return;
    }
    if ((user.state === "ready" && !user()) || user.error) {
      setUserStoreData(null);
      removeItem("authToken");
      navigate("/");
    } else if (user.state === "ready" && user() && currentAuthToken) {
      SocketManager.connect(currentAuthToken);
      setUserStoreData(user());
    }
  });

  return <>{props.children}</>;
};

function App() {
  return (
    <LocalStorageProvider>
      <Router root={Layout}>
        <Route path="/" component={HomePage} />
        <Route path="/games" component={GameList} />
        <Route path="/createUser" component={CreateUserPage} />
      </Router>
    </LocalStorageProvider>
  );
}

export default App;
