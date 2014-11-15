var express = require("express"),
    app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
var crypto = require("crypto");

app.use(express.static(__dirname + "/public"));

var currentUsers = 0;

io.on("connection", function (socket) {
  // Login
  socket.on("login", function (username) {
    if (socket.user) {
      return;
    }

    username = usename.trim();

    if (username.length > 16) {
      return;
    }

    socket.user = {
      id: uid(),
      username: username
    };
    socket.emit("login", socket.user);

    currentUsers++;
    emitCurrentUsers(currentUsers);

    joinLobby(socket);
  });

  // Disconnect
  socket.on("disconnect", function () {
    if (socket.user) {
      delete socket.user;
      currentUsers--;
      emitCurrentUsers(currentUsers);
    }
  });
});

function emitCurrentUsers(currentNum) {
  return io.emit("current users", currentNum);
}

function uid() {
  return crypto.randomBytes(16).toString("hex");
}

function joinLobby(socket) {
}

http.listen(port, function () {
  console.log("Server listening on port: " + port);
});
