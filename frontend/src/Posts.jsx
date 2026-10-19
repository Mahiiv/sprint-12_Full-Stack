import { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;

function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    // runs one time when the page opens, goes and gets the posts from my backend
  useEffect(function () {
    fetch(API + "/posts")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data); // just checking what came back
        setPosts(data);
        setLoading(false);
      })
      .catch(function (err) {
        // if the backend is off we come here
        setError("Could not connect to the server");
        setLoading(false);
      });
  }, []);

  // sends the new post to my backend, backend puts it in mongodb
  function addPost() {
    // not sending empty posts
    if (title === "" || content === "") {
      return;
    }

    fetch(API + "/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, content: content }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data); // checking what the backend sent back
        // adding the new post to the list on screen
        setPosts(posts.concat([data]));
        // clearing the boxes
        setTitle("");
        setContent("");
      });
  }

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

  return (
    <div>
      <h2 id="posts-title">Posts</h2>
      {loading && <p id="loading-msg">Loading...</p>}
      {error !== "" && <p id="error-msg">{error}</p>}

      <input
        id="post-title-input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={function (e) {
          setTitle(e.target.value);
        }}
      />
      <input
        id="post-content-input"
        type="text"
        placeholder="Content"
        value={content}
        onChange={function (e) {
          setContent(e.target.value);
        }}
      />
      <button id="add-post-btn" onClick={addPost}>
        Add Post
      </button>

      {posts.map(function (post) {
        return (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button
              onClick={function () {
                deletePost(post._id);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;