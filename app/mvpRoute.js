var profile = m.prop([]);

m.requestTransactions({
  method: "GET",
  url: "/"
}).then(profile);
// this will set profile.
// if it matches a full profile, redirect and do stuff.
// do the logic in the model
// https://lhorie.github.io/mithril/mithril.request.html

var users = m.request({
  method: "GET",
  url: "/user",
  unwrapSuccess: function(response) {
    return response.data;
  },
  unwrapError: function(response) {
    return response.error;
  }
});

//assuming the response is: `{data: [{name: "John"}, {name: "Mary"}], count: 2}`
//then when resolved (e.g. in a view), the `users` getter-setter will contain a list of users
//i.e. users() //[{name: "John"}, {name: "Mary"}]

// YOUR CODE HERE:
var app = {

  init: function() {
    $('.username').on('click', function() {
      app.addFriend();
    });
    $('.submit').on('click', function() {
      app.handleSubmit();
      app.clearMessages();
      app.fetch();
    });
    $('.refresh').on('click', function() {
      app.clearMessages();
      app.fetch();
    });
    app.fetch();
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http: //127.0.0.1:3000',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: '',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(data) {
    $.ajax({
      url: 'http://127.0.0.1:3000',
      type: 'GET',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        var messageKey = 0;
        var content = data.results;
        var $feed = $('.feed');
        $feed.html('');
        while (content[messageKey]) {
          app.addMessage(content[messageKey], messageKey);
          messageKey++;
        }
        console.log('chatterbox: Message received');
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive messages');
      }
    });
  },

  clearMessages: function() {
    $('.feed').empty();
  },

  addMessage: function(content, index) {
    var user = content.username;
    user = escaper(user, 20);
    var chat = content.text;
    chat = escaper(chat, 140);
    var room = content.roomname;
    room = escaper(room, 20);
    if (app.rooms.indexOf(room) === -1) {
      app.rooms.push(room);
      var $room = $("<div>").append("<a class='" + room + "'>" + room + "</a>");
      $($room).on("click", app.addRoom);
      // var roomText = document.createElement(room);
      // roomDiv.appendChild(roomText);
      $(".roomlist").append($room);
      app.rooms.push(room);
    }

    var $chat = $('<div class="chatLine"></div>');
    var a = document.createElement('a');
    var messageText = document.createTextNode(user);
    a.appendChild(messageText);
    $(a).on("click", app.addFriend);
    $(a).on("mouseenter", mouseenterer);
    $(a).on("mouseleave", mouseleaver);
    $(a).addClass(user);
    $(a).attr("id", index);
    $chat.appendTo($('.feed'))
      .append(a)
      .append('<span class="' + index + '">' + chat + '</span>');

    $chat.append('<span class="timestamp" data-livestamp=' + content.createAt + '"></span>')
      .append('<span class="roomname" id = ' + room + '">' + room + '</span>');
  },

  addRoom: function() {
    console.log(this);
    // roomName = this;
    _.each(app.rooms, function(isRoom) {
      if (isRoom !== roomName) {
        $("div ." + isRoom).parent().slideToggle();
      }
    });
    roomToggle = !userToggle;

  },

  friends: [],
  rooms: [],

  addFriend: function() {
    var name = this.innerHTML;
    console.log(name);
    if (app.friends.indexOf(name) === -1) {
      app.friends.push(name);
      var friend = document.createElement('div');
      var friendsText = document.createTextNode(name);
      friend.appendChild(friendsText);
      $(".friendslist").append(friend);
    }
    $("." + name).parent().css("background", "#FFED5F");
  },

  handleSubmit: function() {
    var myMessage = $('#enterMessage:text').val();
    var myName = $('#enterName:text').val();
    var myRoom = $('#enterRoom:text').val();
    var message = {
      username: myName,
      text: myMessage,
      roomname: myRoom
    };
    console.log("message");
    console.log(message);
    app.send(message);
  }
};

var escaper = function(string, end) {

  var alphanumeric = /[\w\s\']/;
  var newString = "";
  if (string) {
    for (var i = 0; i < string.length && i < end; i++) {
      if (alphanumeric.test(string.charAt(i))) {
        newString += string[i];
      }
    }
  }
  return newString;
};

var mouseleaver = function() {
  $(this).css("background-color", "black");
};
var mouseenterer = function() {
  $(this).css("background-color", "#FF005E");
};

$(document).ready(function() {
  app.init();
});

//     if (wasTrue === true) {
//         userToggle = !userToggle;
//         userPage(author);
//         wasTrue = !wasTrue;
//         userToggle = !userToggle;
//     }
//     livestampGlobal.update();
//     LoadButtons();
// }
// $(document).ready(function() {
//     $('p').each(function() {
//         $(this).html(linkHashtags($(this).html()));
//     });
// });

// function userPage(user) {
//
