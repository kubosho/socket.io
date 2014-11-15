var express = require("express"),
    app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
var crypto = require("crypto");

app.use(express.static(__dirname + "/public"));

var roomMap = {};
var currentUsers = 0;

io.on("connection", function (socket) {
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

  socket.on("disconnect", function () {
    if (socket.user) {
      delete socket.user;
      currentUsers--;
      emitCurrentUsers(currentUsers);
    }
  });

  socket.on("add room", function () {
    if (!socket.user) {
      return;
    }

    var room = new Room(socket.user);
    if (roomMap[room.id]) {
      return;
    }

    roomMap[room.id] = room;
    join(socket, room.id);
  });
});

function emitCurrentUsers(currentNum) {
  return io.emit("current users", currentNum);
}

function uid() {
  return crypto.randomBytes(16).toString("hex");
}

function rooms() {
  return Object.keys(roomMap).map(function (roomId) {
    return roomMap[roomId];
  });
}

function joinLobby(socket) {
  socket.join("lobby", function (err) {
    if (err) {
      return;
    }

    socket.roomId = "lobby";
    socket.emit("join lobby", rooms());
  });
}

function join(socket, roomId) {
  var room = roomMap[roomId];
  if (!room) {
    return;
  }

  leave(socket);

  socket.join(roomId, function (err) {
    if (err) {
      return;
    }

    var room = roomMap[roomId];
    if (!room) {
      return;
    }

    if (!~room.sockets.indexOf(socket)) {
      room.sockets.push(socket);
    }

    socket.roomId = roomId;
    socket.emit("join room", room);
    socket.broadcast.to("lobby").emit("room updated", room);
    socket.broadcast.to(roomId).emit("user joined", socket.user);
  });
}

function leave(socket) {
  var roomId = socket.roomId;
  if (!roomId) {
    return;
  }

  socket.leave(roomId);
  socket.roomId = null;

  if ("lobby" === roomId) {
    socket.emit("leave lobby");
    return;
  }
}

function Room(user) {
  this.id = user.id;
  this.name = user.username + "\'s game";
  this.sockets = [];
}

Room.prototype.toJSON = function () {
  return {
    id: this.id,
    name: this.name,
    users: this.sockets.map(function (socket) {
      return socket.user;
    })
  };
};

http.listen(port, function () {
  console.log("Server listening on port: " + port);
});
