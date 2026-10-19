function MovieCard(props) {
  const movie = props.movie;

  const isFav = props.favorites.some(function (f) {
    return f.id === movie.id;
  });

  // release_date looks like 2024-05-17, I only want the year
  let year = "N/A";
  if (movie.release_date) {
    year = movie.release_date.slice(0, 4);
  }

  let rating = "N/A";
  if (movie.vote_average) {
    rating = movie.vote_average.toFixed(1);
  }

  return (
    <div>
      {/* poster_path can be null so show a gray box then */}
      {movie.poster_path ? (
        <img src={"https://image.tmdb.org/t/p/w500" + movie.poster_path} alt={movie.title} />
      ) : (
        <div>No Poster</div>
      )}

      <button
        onClick={function () {
          props.toggleFavorite(movie);
        }}
        style={{ color: isFav ? "rgb(229, 9, 20)" : "rgb(255, 255, 255)" }}
      >
        {isFav ? "♥" : "♡"}
      </button>

      <h3>{movie.title}</h3>
      <p>
        {year} • ⭐ {rating}
      </p>
    </div>
  );
}

export default MovieCard;
