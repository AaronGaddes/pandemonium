import { action, useNavigate, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const postNewUser = action(async (formData: FormData) => {
    const username = formData.get("username");
    if (typeof username !== "string") {
      throw new Error("Invalid username");
    }

    const body = JSON.stringify({ username });

    console.log("body", body);

    const response = await fetch("/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const { token } = await response.json();
    localStorage.setItem("authToken", token);

    navigate("/");
  });
  const submission = useSubmission(postNewUser);

  return (
    <div>
      <h1>Create New User</h1>
      <form action={postNewUser} method="post">
        <input name="username" type="text" placeholder="Username" />
        <button type="submit">Create User</button>
        <Show when={submission.error && !submission.pending}>
          <p>Error: {submission.error.message}</p>
        </Show>
        <Show when={submission.pending}>
          <p>Creating user...</p>
        </Show>
      </form>
    </div>
  );
};
