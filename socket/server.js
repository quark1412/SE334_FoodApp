const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Handle driver location updates
  socket.on("driver_location_update", (data) => {
    console.log("Driver location update received:", data);

    // Broadcast to all clients who are subscribed to this specific order's channel
    io.emit(`driver_location_${data.orderId}`, data);
  });

  // Handle route updates from driver
  socket.on("route_update", (data) => {
    console.log("Route update received:", data);

    // Broadcast route to all clients subscribed to this order's channel
    io.emit(`route_${data.orderId}`, data);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Location tracking WebSocket server is running");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
