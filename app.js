const express = require("express");
const app = express();
const server = require("http").Server(app);
var io = require("socket.io")(server);
const path = require("path");

PORT = process.env.PORT || 5000;

let locationMap = new Map();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", socket => {
  socket.on("updateLocation", pos => {
    locationMap.set(socket.id, pos);
    console.log(socket.id)
  });
  socket.on("getLocations", () => {
    socket.emit("currentLocations", Array.from(locationMap));
  });
  socket.on("disconnect", () => {
      console.log("disconnected",socket.id)
    locationMap.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
