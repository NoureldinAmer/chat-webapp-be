const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { promisify } = require("util");
const app = require("./app");
const http = require("http");
const initSocket = require("./socket");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1); // Exit Code 1 indicates that a container shut down, either because of an application failure.
});

dotenv.config({ path: "./.env" });
const server = http.createServer(app);

const io = initSocket(server);

mongoose
  .connect(process.env.DATABASE)
  .then((con) => {
    console.log("[CONNECTED TO DB]");
  })
  .catch((err) => {
    console.error("[DB CONNECTION ERROR]", err);
  });

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
  });
});
