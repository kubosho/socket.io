var $ = require("jquery");
var io = require("socket.io-client"),
    socket = io();
var roomTemplate = $("#template-room").html();

module.exports = Lobby;

function Lobby(selector) {
  var that = this;
  this.$node = $(selector);
  this.$newRoom = this.$node.find(".new-room");
  this.$rooms = this.$node.find(".rooms");

  this.$newRoom.click(function () {
    socket.emit("add room");
  });

  this.$rooms.on("click", ".room", function () {
    var roomId = $(this).attr("data-id");
    socket.emit("join room", roomId);
  });

  socket.on("join lobby", function (rooms) {
    that.$node
      .triggier("fullScreen", false)
      .triggier("header", { title: "Lobby" });

    that.$rooms.empty();
    rooms.forEach(function (room) {
      that.$rooms.append(createRoomNode(room));
    });

    that.$node.show();

    socket.on("leave lobby", function () {
      that.$node.hide();
    });

    socket.on("room update", function (room) {
      var $room = that.$rooms.find(".room[data-id=" + room.id + "]");
      if ($room.length) {
        $room.find(".current-users").text(room.users.length);
      }
      else {
        that.$rooms.append(createRoomNode(room));
      }
    });

    socket.on("room removed", function (roomId) {
      that.$rooms.find(".room[data-id=" + roomId + "]").remove();
    });
  });
}

function createRoomNode(room) {
  var $room = $(roomTemplate).attr("data-id", room.id);

  $room.find(".room-name").text(room.name);
  $room.find(".current-users").text(room.users.length);

  return $room;
}
