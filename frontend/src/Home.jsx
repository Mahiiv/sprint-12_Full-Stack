import { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard.jsx";

const token = import.meta.env.VITE_TMDB_KEY;

function Home(props) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // searchText = what is typed right now, query = what we actually search (after 500ms)
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  const endRef = useRef(null); // the invisible div at the bottom
  const loadingRef = useRef(false); // same as loading but updates instantly (observer needs this)
  const queryRef = useRef(""); // to ignore old responses

  async function loadMovies(pageNumber, searchWord) {
    loadingRef.current = true;
    setLoading(true);
    setError("");

    let url = "https://api.themoviedb.org/3/movie/popular?page=" + pageNumber;
    if (searchWord !== "") {
      url =
        "https://api.themoviedb.org/3/search/movie?query=" +
        encodeURIComponent(searchWord) +
        "&page=" +
        pageNumber;
    }
    // this log is for the demo video, shows one request per search
    console.log("fetching:", url);

    try {
      const res = await fetch(url, {
        headers: { Authorization: "Bearer " + token, accept: "application/json" },
      });
      if (!res.ok) {
        throw new Error("Request failed with status " + res.status);
      }
      const data = await res.json();

      // if user already searched something else, throw this response away
      if (searchWord !== queryRef.current) {
        return;
      }

      if (pageNumber === 1) {
        setMovies(data.results);
      } else {
        // keep old movies and add the new ones at the end
        setMovies(function (prev) {
          return [...prev, ...data.results];
        });
      }
      setTotalPages(data.total_pages);
    } catch (err) {
      setError("Something went wrong: " + err.message);
    }

    if (searchWord === queryRef.current) {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  // DEBOUNCE: every keystroke starts a 500ms timer, the old timer gets cancelled.
  // so only when typing stops for 500ms the query changes
  useEffect(
    function () {
      const timer = setTimeout(function () {
        setPage(1);
        setQuery(searchText);
      }, 500);

      return function () {
        clearTimeout(timer);
      };
    },
    [searchText]
  );

  // query changed (or first load) -> start again from page 1
  useEffect(
    function () {
      queryRef.current = query;
      loadMovies(1, query);
    },
    [query]
  );

  // page went up -> fetch that page and add it
  useEffect(
    function () {
      if (page > 1) {
        loadMovies(page, query);
      }
    },
    [page]
  );

  // INFINITE SCROLL: when the bottom div is visible, go to the next page
  useEffect(
    function () {
      const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !loadingRef.current && page < totalPages) {
          setPage(page + 1);
        }
      });
      observer.observe(endRef.current);

      return function () {
        observer.disconnect();
      };
    },
    [loading, page, totalPages]
  );

  return (
    <div>
      <div id="search-box">
        <input
          id="search-input"
          type="text"
          placeholder="Search movies..."
          value={searchText}
          onChange={function (e) {
            setSearchText(e.target.value);
          }}
        />
      </div>

      <h2 id="section-title">{query === "" ? "Popular Movies" : 'Results for "' + query + '"'}</h2>

      {error !== "" && <p id="error-msg">{error}</p>}

      <div id="movie-grid">
        {movies.map(function (movie, index) {
          return (
            <MovieCard
              key={movie.id + "-" + index}
              movie={movie}
              favorites={props.favorites}
              toggleFavorite={props.toggleFavorite}
            />
          );
        })}
      </div>

      {loading && <p id="loading-msg">Loading...</p>}
      {!loading && movies.length === 0 && error === "" && <p id="empty-msg">No movies found</p>}

      <div id="scroll-end" ref={endRef}></div>
    </div>
  );
}

export default Home;
