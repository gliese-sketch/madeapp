import http from "http";
import express from "express";
import { Server } from "socket.io";
import axios from "axios";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Socket.io server is healthy!");
});

// MARK: Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Someone connected with ${socket.id} id.`);

  socket.on("user", (data) => {
    socket.broadcast.emit("new_user", data);
  });

  socket.on("message", async (data) => {
    if (data.content.startswith("@ai")) {
      console.log("AI Detected");

      const options = {
        method: "POST",
        url: "https://api.wakati.tech/ai",
        headers: { "Content-Type": "application/json" },
        body: {
          prompt: data.content.replaceAll("@ai"),
        },
      };

      try {
        const { data } = await axios.request(options);
        const newMsg = { ...data, content: data };
        socket.broadcast.emit("new_message", newMsg);
      } catch (error) {
        console.error(error);
      }
    } else {
      socket.broadcast.emit("new_message", data);
    }
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });
});

server.listen(8080, () => {
  console.log("Server listening on PORT: 8080");
});
