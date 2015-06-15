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



var twit = {};
twit.Twit = function(data) {
  this.message = m.prop(data.message);
  this.user = m.prop(data.user);
  this.timestamp = m.prop(data.created_at);
  this.hidden = false;
};
twit.TwitList = Array;

twit.vm = (function() {
  var vm = {};
  vm.count = 0;
  streams.users.anonymous = [];

  vm.init = function() {
    vm.list = new twit.TwitList();
    vm.message = m.prop('');

    vm.refresh = function() {
      while (vm.count < streams.home.length) {
        vm.list.unshift(new twit.Twit(streams.home[vm.count]));
        vm.count++;
      }
    };

    vm.add = function() {
        if (vm.message()) {
          addTweet({
            message: vm.message(),
            user: "anonymous",
            created_at: new Date(),
            hidden: false
          });
          vm.message('');
          vm.refresh();
          livestampGlobal.update();
        }
      },
      vm.userPage = function() {
        var user = this.innerHTML;

        twit.vm.list.map(function(line) {
          if (line.user() !== user) {
            line.hidden = true;
          }
        });
        // if (userToggle !== true) {
        //   author = user.title;
        // }
        // users.forEach(function(isUser) {
        //     if (isUser !== author) {
        //       $("div ." + isUser)
        //         .parent()
        //         .slideToggle();
        //     }
        //   }),
        //   userToggle = !userToggle;

      };
    vm.refresh();
  };
  return vm;
})();

twit.controller = function() {
  twit.vm.init();
};

hashtag_regexp = /#([a-zA-Z0-9]+)/g; // hashtag highlighting modified from this SO answer http://stackoverflow.com/a/4913601
linkHashtags = function(text, size) {
  var hashPos = text.indexOf("#");
  if (hashPos > -1) {
    var plain = text.slice(0, hashPos);
    var hashText = text.slice(hashPos);

    return m("span", {
      class: "message"
    }, [
      m("span", {
          style: {
            "font-size": size
          }
        },
        plain),
      m("span", {
          class: "hashtag",
          style: {
            "font-size": size
          }
        },
        hashText)
    ]);
  } else return m("span", {
      class: "message",
      style: {
        "font-size": size
      }
    },
    text);
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
  "-webkit-transition": "height 1s ease",
  "-o-transition": "height 1s ease",
  "transition": "all 2s ease"
}
var showDiv = {
  "visibility": "visible",
  "opacity": 1,
  "transition-delay": "0s"
}

//

twit.view = function() {
  return m("html", [
    m("link[href='main.css'][rel=stylesheet]"),
    m("header", {
      id: "headRow"
    }, [
      m("span", {
        id: "trademark"
      }, "twittler"),
      m("input", {
        onchange: m.withAttr("value", twit.vm.message),
        value: twit.vm.message(),
        onkeydown: function(e) { // why don't this work?
          if (e.keyCode === 13) {
            console.log("enter");
            twit.vm.add(this.value);
          } else m.redraw.strategy("none");
        },
        placeholder: " what's on your mind?"
      }),
      m("button", {
        onclick: twit.vm.add,
      }, "twit"),
      m("button", {
        id: "refresh",
        onclick: twit.vm.refresh,
      }, "refresh")
    ]),
    m("body", [
      twit.vm.list.map(function(line, index) {
        var styleMultiplier = {};
        styleMultiplier.user = 10 / line.user().length + "em";
        styleMultiplier.message = 50 / line.message().length + "em";
        return m("div", {
          class: line.user(),
          style: line.hidden ? hideDiv : showDiv
        }, [
          "@", m("a", {
            class: line.user(),
            onclick: twit.vm.userPage,
            style: {
              "font-size": styleMultiplier.user,
            }
          }, line.user()),
          linkHashtags(line.message(), styleMultiplier.message),
          m("span", {
            "class": "livestamp",
            "data-livestamp": line.timestamp(),
          }),
        ]);
      })
    ])
  ]);
};

m.mount(document, {
  controller: twit.controller,
  view: twit.view
});
