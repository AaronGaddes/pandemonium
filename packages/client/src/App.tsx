import {
  Component,
  createEffect,
  createResource,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import "./App.css";
import { Route, Router, RouteSectionProps, useNavigate } from "@solidjs/router";
import { CreateUserPage } from "./pages/CreateUserPage";
import { UserHomePage } from "./pages/UserHomePage";
import { userStore } from "./stores/userStore";
import SocketManager from "./stores/SocketManager";
import { User } from "../../shared/src";
import { HomePage } from "./pages/HomePage";
// import { SessionProvider, useSession } from "./stores/sessionContext";

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
  // Set up a signal to store the auth token
  // and initialize it with the value from localStorage
  const [authToken, setAuthToken] = createSignal<string | null>(
    localStorage.getItem("authToken")
  );

  // Listen for changes to the auth token in localStorage
  const handleAuthTokenChange = (storageEvent: StorageEvent) => {
    if (storageEvent.key === "authToken") {
      setAuthToken(storageEvent.newValue);
    }
  };

  onMount(() => {
    window.addEventListener("storage", handleAuthTokenChange);
  });

  onCleanup(() => {
    window.removeEventListener("storage", handleAuthTokenChange);
  });

  const navigate = useNavigate();

  const [user] = createResource(authToken, fetchSelf);

  const [_, setUserStoreData] = userStore;

  // If the user doesn't exist or there was an error fetching the user,
  // navigate to the create user page
  // Otherwise, connect the socket and set the user in the user store
  createEffect(() => {
    const currentAuthToken = authToken();
    if ((user.state === "ready" && !user()) || user.error) {
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
    <Router root={Layout}>
      <Route path="/" component={HomePage} />
      <Route path="/games" component={UserHomePage} />
      <Route path="/createUser" component={CreateUserPage} />
    </Router>
  );
}

export default App;
