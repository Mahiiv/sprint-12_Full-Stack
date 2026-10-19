import { Link } from "react-router-dom";
import MovieCard from "./MovieCard.jsx";

function Favorites(props) {
  return (
    <div>
      <h2 id="section-title">My Favorites</h2>

      {props.favorites.length === 0 && (
        <p id="empty-msg">
          Nothing here yet. <Link to="/">Go heart some movies</Link>
        </p>
      )}

      <div id="movie-grid">
        {props.favorites.map(function (movie) {
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorites={props.favorites}
              toggleFavorite={props.toggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;
