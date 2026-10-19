import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home.jsx";
import Favorites from "./Favorites.jsx";
import Posts from "./Posts.jsx";
import Chat from "./Chat.jsx";

function App() {
  // favorites start from localStorage so they stay after reload
  const [favorites, setFavorites] = useState(function () {
    const saved = localStorage.getItem("cinestream-favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return [];
      }
    }
    return [];
  });

  // every time favorites changes, save it again
  useEffect(
    function () {
      localStorage.setItem("cinestream-favorites", JSON.stringify(favorites));
    },
    [favorites]
  );

  // heart button: if movie is already there remove it, else add it
  function toggleFavorite(movie) {
    const alreadyThere = favorites.some(function (f) {
      return f.id === movie.id;
    });
    if (alreadyThere) {
      setFavorites(
        favorites.filter(function (f) {
          return f.id !== movie.id;
        })
      );
    } else {
      setFavorites([...favorites, movie]);
    }
  }

  return (
    <div>
      <div id="navbar">
        <h1>CINE-STREAM</h1>
        <div>
          <Link to="/">Home</Link>
          <Link to="/favorites">My Favorites ({favorites.length})</Link>
          <Link to="/posts">Posts</Link>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={<Home favorites={favorites} toggleFavorite={toggleFavorite} />}
        />
        <Route
          path="/favorites"
          element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} />}
        />
        <Route path="/posts" element={<Posts />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
