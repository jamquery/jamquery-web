import express from "express";
import helmet from "helmet";
import cors from "cors";
import { api } from "./routes";
import database from "./database";
import parsePort from "./parsePort";

// Setup express
const app = express();

const errorHandler = (err, _req, res, _next) => {
  // Do logging and user-friendly error message display
  console.error(err.stack);
  res.status(500).send("internal server error");
};

app.use(cors());
app.use(helmet());
app.use(errorHandler);
app.use(express.json());
app.use(express.static("public"));

// mount the router on the app
app.use("/api", api(database()));
app.get("/", (_req, res) => {
  res.redirect("/index.html");
});

// Listening to requests
const port = parsePort(process.argv);
app.listen(port, () => {
  console.log(`Express server has started on port ${port}`);
});
