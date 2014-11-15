var $ = require("jquery");
var io = require("socket.io-client"),
    socket = io();

module.exports = Login;

/**
 * @constructor
 */
function Login(selector) {
  var that = this;
  this.$node = $(selector);
  this.$form = this.$node.find("form");
  this.$input = this.$node.find("input.username");

  function init() {
    this.$node.show();
    this.$input.focus();
  }

  this.$node.click(function (event) {
    that.$input.focus();
  });

  this.$form.submit(function (event) {
    event.preventDefault();

    var username = that.$input.val().trim();
    socket.emit("login", username);
  });

  socket.on("login", function (user) {
    socket.user = user;
    that.$node.hide();
  });

  init();
}
