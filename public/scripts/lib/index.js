var $ = require("jquery");
var Login = require("./login");
var Header = require("./header");
var Lobby = require("./lobby");

$(function () {
  new Login(".page.login");
  new Header(".header");
  new Lobby(".page.lobby");

  $(document).on("fullscreen", function (event, enabled) {
    $(".wrapper").toggleClass("full-screen", enabled);
  });
});
