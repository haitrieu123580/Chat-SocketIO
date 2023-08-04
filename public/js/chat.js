var socket = io();
var messages = document.getElementById("messages");

(function() {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    socket.emit("chat-message", {
      msg: $("#message").val(),
      // userId: $("#userId").val(),
      sender: $("#username").text().trim()
    });
    // console.log($("#username").text())
    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + $("#username").text().trim() + ": " + "just now");

    $("#message").val("");

    return false;
  });

  socket.on("received", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    console.log("Hello bingo!");
  });
  
socket.emit('logined',$("#username").text().trim())
var $users = $('#users')
socket.on('get-users', (data) => {
  var html = '';
  for (i = 0; i < data.length; i++) {
      html += `<li class = "list-group-item">${data[i]}</li>`
  }
  $users.html(html);
});
})();

// fetching initial chat messages from the database
(function() {
  fetch("/chats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
      });
    });
})();
