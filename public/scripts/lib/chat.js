var $ = require("jquery");
var io = require("socket.io-client"),
    socket = io();
var messageTemplate = $("#template-message").html();
var logTemplate = $("#template-log").html();

module.exports = Chat;

function Chat(selector, opts) {
  var that = this;
  this.$node = $(selector);
  this.$input = this.$node.find("input.message");
  this.$messages = this.$node.find(".messages");

  opts = opts || {};
  this.messageEvent = opts.messageEvent || "message";

  this.$form.submit(function (event) {
    event.preventDefault();

    var message = that.$input.val().trim();
    if (!message) {
      return;
    }

    socket.emit("message", message);
    that.$input.val("");
    that.addMessage(socket.user, message);
  });

  socket.on(this.messageEvent, this.addMessage.bind(this));
}

var prop = Chat.prototype;

prop.refresh = function () {
  this.$messages.empty();
  this.focus();
};

prop.focus = function () {
  this.$input.focus();
};

prop.log = function (message) {
  this.$messages.append(createLog(message));
};

prop.addMessage = function (user, message) {
  createMessage(user, message).appendTo(this.$messages);
  this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
};

function createMessage(user, message) {
  var $message = $(messageTemplate);
  $message.find(".username").text(user.username);
  $message.find(".body").text(message);
  return $message;
}

function createLog(text) {
  return $(logTemplate).text(text);
}
