require("dotenv").config();
const express = require("express");
const { createClerkClient } = require("@clerk/clerk-sdk-node");

const app = express();
const port = 3000;

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

app.use("/", async (req, res, next) => {
  let token = req.headers["Authorization"];
  // token should have following format: Bearer <token>
  token = token.substring(7);

  const jwt = await clerkClient.verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const session = await clerkClient.sessions.getSession(jwt.sid);
  req.userId = session.userId;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
