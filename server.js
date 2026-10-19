// my dns was failing so using google dns
require("node:dns").setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
var express = require("express");
var cors = require('cors');
var mongoose = require("mongoose");
var Post = require("./models/Post");
var http = require("http");
var Server = require("socket.io").Server;

var app = express();
// making a real http server and putting express inside it (socket.io needs this)
var server = http.createServer(app);

// socket.io server, the cors part lets my react app (vite) talk to it
// list of websites allowed to connect, localhost for me and CLIENT_URL for the live site
var allowedOrigins = ["http://localhost:5173"];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// socket.io server, the cors part lets my react app talk to it
var io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});
// letting the frontend talk to this server
app.use(cors());

// so i can read req.body
app.use(express.json());

// connecting to atlas
mongoose.connect(process.env.MONGO_URI)
  .then(function () {
    console.log("mongodb connected");
  })
  .catch(function (err) {
    console.log("connection error", err);
  });

// GET all posts, asks the database
app.get("/posts", function (req, res) {
  Post.find()
    .then(function (posts) {
      res.json(posts);
    })
    .catch(function (err) {
      res.status(500).json({ message: "Something went wrong", error: err.message });
    });
});

// GET one post by id (still the placeholder for now)
app.get("/posts/:id", function (req, res) {
  res.json({ message: "Route active" });
});

// POST a new post, saves it in the database
app.post("/posts", function (req, res) {
  Post.create({
    title: req.body.title,
    content: req.body.content
  })
    .then(function (newPost) {
      res.status(201).json(newPost);
    })
    .catch(function (err) {
      res.status(500).json({ message: "Could not create post", error: err.message });
    });
});

// DELETE a post by its mongo id (long string now, not a number)
app.delete("/posts/:id", function (req, res) {
  Post.findByIdAndDelete(req.params.id)
    .then(function (deletedPost) {
      
        // tells the backend to delete one post, id says which one
  function deletePost(id) {
    fetch("http://localhost:5000/posts/" + id, {
      method: "DELETE",
    }).then(function (res) {
      console.log(res.status); // checking if it worked
      // keeping every post except the one I deleted
      setPosts(
        posts.filter(function (post) {
          return post._id !== id;
        })
      );
    });
  }
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted", post: deletedPost });
    })
    .catch(function (err) {
      res.status(500).json({ message: "Could not delete post", error: err.message });
    });
});

var PORT = process.env.PORT || 5000;

// runs every time someone connects (the handshake)
io.on("connection", function (socket) {
  console.log("someone connected: " + socket.id);

  // the client sends an object with the name and the text
  socket.on("send_message", function (data) {
    console.log("got message from " + data.name + ": " + data.text);

    // sending the whole object back to everyone
    io.emit("receive_message", data);
  });

  // someone is typing, tell everyone else (not the person typing)
  socket.on("typing", function (name) {
    console.log("typing from: " + name);
    socket.broadcast.emit("user_typing", name);
  });

  // they stopped typing, tell everyone else
  socket.on("stop_typing", function () {
    socket.broadcast.emit("user_stop_typing");
  });

  // runs when that person leaves
  socket.on("disconnect", function () {
    console.log("someone left: " + socket.id);
  });
});

server.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});