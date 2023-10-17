const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const httpStatus = require("http-status");
const logger = require("./config/logger");
const config = require("./config/config");
const {
  errorConverter,
  errorHandler,
} = require("./api/middlewares/error.middleware");
const socket = require("socket.io");
const { setMessagesDelivered, setMessageSeen } = require("./api/utils/socket.utils");
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(cors());

require("./api/routes/index")(app);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  throw new Error("Manual error is thrown");
});

//   // convert error to ApiError , if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log("Server listening at port, ", config.port);
});

const io = socket(server, {
  cors: {
    origin: "https://main--peaceful-douhua-0c646d.netlify.app",
    methods: ["GET", "POST"],
  },
});
global.onlineUsers = {};
global.socketToUser = {};
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers[userId]=socket.id;
    socketToUser[socket.id]=userId;
    console.log("Adduser called for", onlineUsers);
    setMessagesDelivered(userId);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers[data.to];
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });
  socket.on("msg-receive-ack",(data) =>{
    setMessageSeen(data);
    data.status = "Seen";
    const sendUserSocket = onlineUsers[data.from];
    socket.to(sendUserSocket).emit("msg-send-ack",data)
  })

  socket.on("check-user-session", (userId) => {
    console.log("Check user session received",onlineUsers)
    const sendUserSocket = onlineUsers[userId];
    console.log(sendUserSocket)
    socket.emit("set-user-session", onlineUsers);
  });
  socket.on("message-seen",(data)=>{
    console.log("message-seen received",data)
    const sendUserSocket = onlineUsers[data.from];
    socket.to(sendUserSocket).emit("message-seen-ack",data);
  })
  socket.on("disconnect", () => {
    console.log("User disconnected - ", socket.id);
    delete onlineUsers[socketToUser[socket.id]];
    delete socketToUser[socketToUser[socket.id]]
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
