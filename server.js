#!/usr/bin/env node

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({
    now: new Date(),
    status: "up and running"
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== "sina" || password !== "password") {
    return res.status(401).json({
      status: 401,
      message: "invalid username or password"
    });
  }

  jwt.sign(
    {
      username: "sina",
      firstName: "sina",
      lastName: "haseli"
    },
    "super-secret",
    {
      expiresIn: "6h"
    },
    (err, token) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          err: err
        });
      }

      return res.status(200).json({
        token: token
      });
    }
  );
});

const port = process.env.PORT || "3010";
app.set("port", port);

const server = app.listen(port, "0.0.0.0");
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  console.log("start listening");
  app.set("startAt", new Date());
}
