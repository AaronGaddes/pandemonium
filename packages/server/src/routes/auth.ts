import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env";
import { User as GameUser } from "../../../shared/src";

declare global {
  namespace Express {
    interface User extends GameUser {}
  }
}

export const users: GameUser[] = [];

const authRouter = Router();

authRouter.get(
  "/self",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user =
      (req.user.id && users.find((u) => u.id === req.user.id)) || null;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
);

authRouter.post("/createUser", (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).end();
    return;
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: username,
  };
  users.push(newUser);

  const token = jwt.sign(
    {
      data: newUser,
    },
    JWT_SECRET,
    {
      issuer: "accounts.pandemonium.com",
      audience: "pandemonium.com",
      expiresIn: "1h",
    }
  );

  res.json({ token });
});

export default authRouter;
