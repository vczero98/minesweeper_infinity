var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
		passport         = require("passport"),
		LocalStrategy    = require("passport-local"),
		// methodOverride = require("method-override"),
		flash            = require("connect-flash"),
		server           = require('http').createServer(app),
    io               = require('socket.io')(server),
		expressSession   = require("express-session"),
		sharedsession    = require("express-socket.io-session"),
		MongoStore       = require('connect-mongo')(expressSession),
		passportSocketIo = require("passport.socketio");

var User = require("./models/user");
//     Comment    = require("./models/comment"),
// 		seedDB     = require("./seeds"),

var port = 3000;

var Room = require("./game/room");

var rooms = [new Room("t", "Test Room", 4, 0)];

var indexRoutes    = require("./routes/index"),
    userRoutes     = require("./routes/users"),
		roomRoutes     = require("./routes/rooms")(rooms);

var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

// seedDB(); // Seed the database
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/minesweeper_infinity");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
var myExpressSession = expressSession({
	secret: "Once again Bonsi wins cutest dog!",
	resave: false,
	saveUninitialized: false,
	store: sessionStore
});

app.use(myExpressSession);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

io.use(sharedsession(myExpressSession, {autoSave:true}));
io.use(passportSocketIo.authorize({
  secret: 'Once again Bonsi wins cutest dog!',
  store: sessionStore,
	fail: function(data, message, error, accept) {
		if(error)  throw new Error(message);
  	return accept();
	}
}));

var gameSocket = require("./game/socket.js")(io);

app.use(function(req, res, next){
	// req.user available on every single route
	if (!req.session.guestNum) {
		req.session.guestNum = Math.floor(Math.random() * 89999 + 10000);
	}
	res.locals.guestNum = req.session.guestNum;
	res.locals.currentUser = req.user;
	res.locals.selectedPage = "";
	res.locals.inGameRoom = false;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/rooms", roomRoutes.router);
app.use("/", userRoutes);
// app.use("/campgrounds/:id/comments", commentRoutes);
// app.use("/campgrounds", campgroundRoutes);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    // res.render('404', { url: req.url });
		res.send("404 Not found");
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(port, "localhost", function(){
	console.log("Server started on port " + port);
});

// socket.io
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
