const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require('body-parser')
const io = require("socket.io").listen(server, {
  log: true,
  origins: '*:*'
})
const next = require("next");
const db = require("./config/database");
const escape = require("sql-template-strings");
var jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== 'production';
const conf = require("./next.config");
const nextApp = next({ dev, conf  });

const nextHandler = nextApp.getRequestHandler();

io.set('transports', [
  'polling', 'websocket'
]);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var channels = {};
io.on('connection', function (socket) {
  var initiatorChannel = '';
  if (!io.isConnected) {
    io.isConnected = true;
  }

  socket.on('new-channel', function (data) {
    if (!channels[data.channel]) {
      initiatorChannel = data.channel;
    }

    channels[data.channel] = data.channel;
    console.log("NEW CHANNEL", data)
    onNewNamespace(data.channel, data.sender);
  });

  socket.on('presence', function (channel) {
    var isChannelPresent = !!channels[channel];
    socket.emit('presence', isChannelPresent);
  });

  socket.on('disconnect', function (channel) {
    if (initiatorChannel) {
      delete channels[initiatorChannel];
    }
  });
});


function onNewNamespace(channel, sender) {
  console.log("CHANNEL", channel);
  console.log("sender", sender)

  io.of('/' + channel).on('connection', function (socket) {
    var username;
    if (io.isConnected) {
      io.isConnected = false;
      socket.emit('connect', true);
    }

    socket.on('message', function (data) {
      console.log(data.sender == sender)
      if (data.sender !== sender) {
        if (!username) username = data.data.sender;
        console.log("data", data)
        socket.broadcast.emit('message', data.data);
      }
    });

    socket.on('disconnect', function () {
      if (username) {
        socket.broadcast.emit('user-left', username);
        username = null;
      }
    });
  });
}

// run app
nextApp.prepare().then(() => {
  app.post("/api/login", async (req, res) => {
    console.log(req.body)
    const users = await db.query(escape`
    Select * from users_login WHERE username = ${req.body.username} && password=${req.body.password}
      `);
    if (users && users.length) {
      var token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: users[0]
        },
        "secretToken"
      );
      res.status(200).json({ token: token, success: true, role: users[0].role });
    } else {
      res
        .status(401)
        .json({ error: true, message: "Invalid username and password" });
    }
  })
  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })
  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log('Please open SSL URL: https://localhost:' + (process.env.PORT || 3000) + '/');

  });
})

