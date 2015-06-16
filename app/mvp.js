// make login
// make profile
// show friends
// show feed
// allow transfers
// maybe look at sportsbook api
// allow requests and rewards
// allow pricelist
// allow "vault" - promises
// show "general state of winningness"
// set up database
// relationship tracker so you always know who's winning
// community-resolved disputes
// upvotes?

// uomeonedb// W62mHkr7Ktb2 //mysql.sener.is

var user = {};

user.USER = function(data) {
  this.name = m.prop(data.name);
  this.email = m.prop(data.email);
  this.balance = m.prop(data.balance);
  this.picture = m.prop(data.picture);
  this.motto = m.prop(data.motto);
  this.password = m.prop(data.password);
};

var player1 = new user.USER({
  name: "Jonathan",
  email: "jonathanpseneris@gmail.com",
  balance: 100,
  picture: "http://sener.is/profile.jpg",
  motto: "In it to WIN IT!",
  password: "1234"
});

var player2 = new user.USER({
  name: "Libby",
  email: "libbydoyne@gmail.com",
  balance: 100,
  picture: "http://sener.is/libby.jpg",
  motto: "Who's idea was this?",
  password: "1234"
});

var activeUser = player1;

// user.UserList = Array;
user.UserList = [player1, player2];

user.vm = (function(profile) {
  var vm = {};

  vm.init = function() {
    vm.list = new user.UserList();
    vm.name = profile.name;
    vm.balance = profile.balance;
    vm.picture = profile.picture;
    vm.motto = profile.motto;

    user.vm.list = new user.UserList();
    vm.addUser = function(profile) {
      if (profile()) {
        user.vm.list.push(profile);
      }
    };
  };

  console.log("ttttttt")
    // user.vm.addUser(player1);
    // user.vm.addUser(player2);
    // console.log(user.vm.list);

  return vm;
})();

var uome = {};
uome.UOME = function(data) {
  this.dataType = m.prop(data.dataType);
  this.message = m.prop(data.message);
  this.user = m.prop(data.user);
  // this.recipient = m.prop(data.user);
  this.timestamp = m.prop(data.created_at);
  this.points = m.prop(data.points);
  this.hidden = false;
};

uome.UOMEList = Array;

uome.vm = (function() {
  var vm = {};
  vm.count = 1;
  streams.users.anonymous = [];
  vm.userToggle = false;

  vm.init = function() {
    vm.list = new uome.UOMEList();
    vm.message = m.prop('');
    vm.points = m.prop('');

    vm.refresh = function() {
      m.request({
        url: 'http://localhost:3000/transactions',
        method: 'GET',
      }).then(function(data) {
        while (vm.count < data.length) {
          console.log(data[vm.count]);
          if (typeof data[vm.count] === 'string') {
            data[vm.count] = JSON.parse(data[vm.count]);
          }
          vm.list.unshift(new uome.UOME(data[vm.count]));
          vm.count++;
        }
      });
    };

    vm.add = function() {
      if (vm.message()) {
        var newTransaction = {
          dataType: "transaction",
          message: vm.message(),
          user: activeUser.name(),
          created_at: new Date(),
          points: vm.points(),
          hidden: false
        };
        m.request({
          url: 'http://localhost:3000/transactions',
          method: 'POST',
          data: JSON.stringify(newTransaction),
        }).then(function(err) {
          vm.message('');
          var newSum = Number(vm.points()) + activeUser.balance();
          activeUser.balance(newSum);
          vm.points('');
          vm.refresh();
          livestampGlobal.update();
        });
      }
    };

    vm.userPage = function() {
      var user = this.innerHTML;
      uome.vm.list.map(function(line) {
        if (line.user() !== user) {
          line.hidden = vm.userToggle ? false : true;
        }
      });
      vm.userToggle = !vm.userToggle;
    };
    vm.refresh();
  };
  return vm;
})();

uome.controller = function() {
  uome.vm.init();
};

// hashtags
hashtag_regexp = /#([a-zA-Z0-9]+)/g; // hashtag highlighting modified from this SO answer http://stackoverflow.com/a/4913601
linkHashtags = function(text, size, points) {
  var hashPos = text.indexOf("#");
  var numSize = size > 1.2 ? 1.2 : size;
  var color = points >= 0 ? "green" : "red";
  if (hashPos > -1) {
    var plain = text.slice(0, hashPos);
    var hashText = text.slice(hashPos);

    return m("span", {
      class: "message"
    }, [
      m("span", {
          style: {
            "font-size": size + "em"
          }
        },
        plain),
      m("span", {
          class: "hashtag",
          style: {
            "font-size": size + "em"
          }
        },
        hashText),
      m("span", {
        class: "transaction",
        style: {
          "font-size": numSize + "em",
          "color": color
        }
      }, points)
    ]);
  } else return m("span", {
      class: "message",
      style: {
        "font-size": size + "em"
      }
    },
    text,
    m("span", {
      class: "transaction",
      style: {
        "font-size": numSize + "em",
        "color": color
      }
    }, points));
};

//

var hideDiv = {
  "visibility": "hidden",
  "opacity": 0,
  // "transition": "visibility 2s, opacity 2s, linear",
  // // "height": 0,
  // "transition": "height 2s"

  // "transition-property": "opacity, height",
  // "transition-duration": "2s 4s",
  // "transition-delay": "2s",
  "height": 0,
  // "-webkit-transition": "height 1s ease",
  // "-o-transition": "height 1s ease",
  // "transition": "all 2s ease"
};
var showDiv = {
  "visibility": "visible",
  // "opacity": 1,
  // "transition-delay": "2s"
};

//

uome.view = function() {

  return m("html", [
    m("link[href='main.css'][rel=stylesheet]"),
    m("header", {
      id: "headRow"
    }, [
      m("span", {
        id: "trademark"
      }, "UOMEONE"),
      m("input", {
        id: "descInput",
        onchange: m.withAttr("value", uome.vm.message),
        value: uome.vm.message(),
        // onkeydown: function(e) { // why don't this work?
        // if (e.keyCode === 13) {
        //   console.log("enter");
        //   uome.vm.add(this.value);
        // } else m.redraw.strategy("none");
        // },
        placeholder: " description"
      }),
      m("input", {
        id: "pointInput",
        type: "number",
        onchange: m.withAttr("value", uome.vm.points),
        value: uome.vm.points(),
        // points: uome.vm.points(),
        // onkeydown: function(e) { // why don't this work?
        // if (e.keyCode === 13) {
        //   console.log("enter");
        //   uome.vm.add(this.value);
        // } else m.redraw.strategy("none");
        // },
        placeholder: " ###"
      }),
      m("button", {
        onclick: uome.vm.add,
      }, "uome"),
      m("button", {
        id: "refresh",
        onclick: uome.vm.refresh,
      }, "refresh")
    ]),
    // m("div", {
    //   class: "userprofiles"
    // }),
    m("body", [
      m("div", {
        class: "profile1",
        "border-color": "blue"
          // "border-color": activeUser === player1 ? "green" : "blue"
      }, [
        m("img", {
          src: player1.picture(),
          onclick: function() {
            activeUser = player1;
          },
        }),
        m("h1", player1.name()),
        m("h2", player1.motto()),
        m("h3", {
            style: {
              "background-color": player1.balance() >= 0 ? "#85FF00" : "#FF005E"
            }
          },
          "balance: ", player1.balance()
        )
      ]),
      m("div", {
        class: "profile2"
      }, [
        m("img", {
          src: player2.picture(),
          onclick: function() {
            activeUser = player2;
          },
        }),
        m("h1", player2.name()),
        m("h2", player2.motto()),
        m("h3", {
            style: {
              "background-color": player2.balance() >= 0 ? "#85FF00" : "#FF005E"
            }
          },
          "balance: ", player2.balance()
        )
      ]),

      uome.vm.list.map(function(line, index) {
        if (line) { //check this
          var styleMultiplier = {};
          styleMultiplier.user = 10 / line.user().length + "em";
          styleMultiplier.message = 45 / (line.message().length + line.points().toString().length);
          return m("div", {
            class: line.user(),
            style: line.hidden ? hideDiv : showDiv
          }, [
            "@", m("a", {
              class: line.user(),
              onclick: uome.vm.userPage,
              style: {
                "font-size": styleMultiplier.user,
              }
            }, line.user()),
            linkHashtags(line.message(), styleMultiplier.message, line.points()),
            m("span", {
              "class": "livestamp",
              "data-livestamp": line.timestamp(),
            }),
          ]);
        }
      })
    ])
  ]);
};

// user.view = function() {

//   return m("div", {
//       class: "profile1"
//     }, [
//       m("img", {
//         src: player1.picture()
//       }),
//       m("h1", player1.name()),
//       m("h2", player1.motto()),
//       m("h3", {
//           style: {
//             "background-color": player1.balance() >= 0 ? "#yellow" : "#FF005E"
//           }
//         },
//         "balance: ", player1.balance()
//       )
//     ]),
//     m("div", {
//       class: "profile2"
//     }, [
//       m("img", {
//         src: player2.picture(),
//         onclick: function() {
//           console.log("test");
//         },
//       }),
//       m("h1", player2.name()),
//       m("h2", player2.motto()),
//       m("h3", {
//           style: {
//             "background-color": player2.balance() >= 0 ? "#85FF00" : "#FF005E"
//           }
//         },
//         "balance: ", player2.balance()
//       )
//     ]);
// };

m.mount(document, {
  controller: uome.controller,
  view: uome.view
});
// m.mount(document.head, {
//   controller: user.controller,
//   view: user.view
// });
