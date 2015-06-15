var profile = m.prop([]);

m.request({method: "GET", url: "/login"}).then(profile);
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