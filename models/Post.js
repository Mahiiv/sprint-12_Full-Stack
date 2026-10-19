var mongoose = require("mongoose");

// this is the blueprint for a post
var postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;