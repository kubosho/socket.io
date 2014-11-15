var $ = require("jquery");
var io = require("socket.io-client"),
    socket = io();

module.exports = Lobby;

function Lobby(selector) {
  var that = this;
  this.$node = $(selector);
  this.$newRoom = this.$node.find(".new-room");
  this.$rooms = this.$node.find(".rooms");

  socket.on("join lobby", function (rooms) {
    that.$node
      .triggier("fullScreen", false)
      .triggier("header", { title: "Lobby" });

    that.$node.show();
  });
}
