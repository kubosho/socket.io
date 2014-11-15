var $ = require("jquery");
var io = require("socket.io-client"),
    socket = io();

module.exports = Header;

function Header(selector) {
  var that = this;
  this.$node = $(selector);
  this.$currentUsers = this.$node.find(".current-users");
  this.$title = this.$node.find(".title");

  $(document).on("header", function (event, data) {
    that.$title.text(data.title);
  });

  socket.on("current users", function (num) {
    that.$currentUsers.text(num);
  });
}
