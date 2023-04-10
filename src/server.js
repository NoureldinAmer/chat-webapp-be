const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io"); // Add this
const { promisify } = require("util");
const app = require("./app");
const http = require("http");
const { uuid } = require("./utils/uuid");

const User = require("./models/user");
const Message = require("./models/message");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1); // Exit Code 1 indicates that a container shut down, either because of an application failure.
});

dotenv.config({ path: "./.env" });
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

io.on("connection", async (socket) => {
  try {
    const user_id = socket.handshake.query["user_id"];
    const something = user_id === null;
    if (user_id !== "null") {
      const user = await User.findByIdAndUpdate(
        user_id,
        {
          $push: {
            socket_IDs: socket.id,
          },
          status: "Offline",
        },
        { new: true }
      );
      console.log(`[USER CONNECTED] ${user.name}`);
      const connection = {
        userID: user._id,
        type: "connection",
        user: user.name,
        connection: "connection",
        id: uuid(),
      };
      socket.broadcast.emit("user_connection", connection);

      const chat_log = await Message.find().populate("from");
      socket.emit("chat_log", chat_log);
    }

    socket.on("new_message", async (data) => {
      console.log(data);
      const { message, from, type } = data;
      const user = await User.findById(from);
      console.log(`[MESSAGE FROM] ${user.name}`);
      const date = Date.now();

      const messageData = {
        id: uuid(),
        type,
        message,
        msgOwner: user.name,
        msgOwnerID: user._id,
        date,
      };

      const incomingData = {
        id: uuid(),
        type: "text",
        message,
        incoming: true,
        outgoing: false,
        msgOwner: user.name,
        date,
      };

      const outgoingData = {
        id: uuid(),
        type: "text",
        message,
        incoming: false,
        outgoing: true,
        msgOwner: user.name,
        date,
      };
      io.emit("incoming_message", messageData);

      const new_message = await Message.create({
        from: from,
        text: data.message,
        type,
      });
      console.log(`[MESSAGE STORED] ${new_message._id}`);
    });

    socket.on("disconnect", async () => {
      const user = await User.findOneAndUpdate(
        { socket_IDs: socket.id },
        {
          $pull: {
            socket_IDs: socket.id,
          },
        },
        { new: true }
      );
      if (user) {
        console.log(`[USER DISCONNECTED] ${user.name}`);
        const disconnection = {
          userID: user._id,
          type: "connection",
          user: user.name,
          connection: "disconnection",
          id: uuid(),
        };
        socket.broadcast.emit("user_connection", disconnection);
      }
    });
  } catch (error) {
    console.error("Error in socket connection:", error);
  }
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
  });
});
