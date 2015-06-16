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

var activeUser = {
  name: m.prop("Jonathan Seneris"),
  email: m.prop("jonathanpseneris@gmail.com"),
  balance: m.prop(100),
  picture: m.prop("http://sener.is/profile.jpg"),
  motto: m.prop("In it to WIN IT!"),
  password: m.prop("1234")
};

var user = {};

user.USER = function(data) {
  this.name = m.prop(data.name);
  this.email = m.prop(data.email);
  this.balance = m.prop(data.balance);
  this.picture = m.prop(data.pic);
  this.motto = m.prop(data.motto);
  this.password = m.prop(data.password);
};

user.UserList = Array;

user.vm = function(profile) {
  var vm = {};

  vm.init = function() {
    vm.list = new user.UserList();
    vm.name = profile.name;
    vm.balance = profile.balance;
    vm.picture = profile.picture;
    vm.motto = profile.motto;

    vm.addUser = function() {};
  };
  return vm;
};

var uome = {};
uome.UOME = function(data) {
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
  vm.count = 0;
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
        console.log(data);
        // while (vm.count <= data.length) {
        for (var i = 0; i < data.length; i++) {
          console.log(data[i]);
          vm.list.push(data[i]);
          vm.count++;
        }
      });
    };

    vm.add = function() {
      if (vm.message()) {
        var newTransaction = {
          message: vm.message(),
          user: "anonymous",
          created_at: new Date(),
          points: vm.points(),
          hidden: false
        };
        // newTransaction = JSON.stringify(newTransaction);
        // console.log(newTransaction);

        m.request({
          url: 'http://localhost:3000/transactions',
          method: 'POST',
          // contentType: 'text/plain',
          // data: newTransaction,
          data: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            // body: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            // test: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        }).then(function(err) {
          console.log(err);
          console.log("done");
          vm.message('');
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
    m("body", [
      m("div", {
        class: "profile"
      }, [
        m("img", {
          src: activeUser.picture()
        }),
        m("h1", activeUser.name()),
        m("h2", activeUser.motto()),
        m("h3", {
            style: {
              "background-color": activeUser.balance() >= 0 ? "#85FF00" : "#FF005E"
            }
          },
          "balance: ", activeUser.balance()
        )
      ]),

      uome.vm.list.map(function(line, index) {
        console.log(line);
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

m.mount(document, {
  controller: uome.controller,
  view: uome.view
});
