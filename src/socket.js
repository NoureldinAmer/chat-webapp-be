const { Server } = require("socket.io");
const { uuid } = require("./utils/uuid");
const {detectLink} = require("./utils/detectLink");
const User = require("./models/user");
const Message = require("./models/message");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    try {
      const user_id = socket.handshake.query["user_id"];
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
        const { message, from, type } = data;
        const user = await User.findById(from);
        console.log(`[MESSAGE FROM] ${user.name}`);
        const date = Date.now();
        const link = detectLink(message);
        let messageData;
        if(link) {
          const filteredString = message.replace(link, "");
          messageData = {
            id: uuid(),
            type: "link",
            link,
            message: filteredString,
            msgOwner: user.name,
            msgOwnerID: user._id,
            date,
          }
          io.emit("incoming_message", messageData);
        } else {
          messageData = {
            id: uuid(),
            type,
            message,
            msgOwner: user.name,
            msgOwnerID: user._id,
            date,
          };
          io.emit("incoming_message", messageData);
        }
  
        const new_message = {
          from: from,
          text: data.message,
          type: link ? "link" : "text"
        }
        if (link) {
          new_message.link = link;
        }
        const stored_message = await Message.create(new_message);
        console.log(`[${stored_message.type} MESSAGE STORED] ${stored_message._id}`);
      });

      socket.on("new_call", async (data) => {
        const {from} = data;
        const user = await User.findById(from);
        console.log(`[CALL FROM] ${user.name}`);
        io.emit("incoming_call", {
          userID: from,
          name: user.name,
        });
      })
  
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

  return io;
};

module.exports = initSocket;
