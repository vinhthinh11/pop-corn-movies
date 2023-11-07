import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorege";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "3c08f54d";

export default function App() {
  // const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorage([], "watchList");
  const { movies, error, isLoading } = useMovies(query, handleCloseMovie);

  const [seletedId, setSelectedId] = useState(null);

  function handleSelectedMovie(movieId) {
    setSelectedId((selectId) => (selectId === movieId ? null : movieId));
  }

  function handleAddWatch(movie) {
    setWatched((va) => [...va, movie]);
  }

  function handleDeleteWatch(id) {
    setWatched((movie) => movie.filter((m) => m.imdbID !== id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  return (
    <>
      <NavBar>
        <Search {...{ query, setQuery }} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList {...{ movies, handleSelectedMovie }} />
          )}
          {error && <ErrorMessage {...{ error }} />}
        </Box>
        <Box>
          {seletedId ? (
            <SelectedMovie
              seletedId={seletedId}
              handleCloseMovie={handleCloseMovie}
              handleAddWatch={handleAddWatch}
              setSelectedId={setSelectedId}
              watched={watched}
              setWatched={setWatched}
              key={seletedId}
            />
          ) : (
            <>
              <Sumary {...{ watched }} />
              <WatchedMoviesList {...{ watched, handleDeleteWatch }} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage(props) {
  return (
    <p className="error">
      <span>{props.error}</span>
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo logo={"🍿"} content={"usePopCorn"} />
      {children}
    </nav>
  );
}
function Logo({ logo, content }) {
  return (
    <div className="logo">
      <span role="img">{logo}</span>
      <h1>{content}</h1>
    </div>
  );
}
function Search(props) {
  const inputEl = useRef(null);
  useKey(
    function () {
      if (document.activeElement === inputEl.current) return;
      inputEl.current.focus();
      props.setQuery("");
    },
    "keypress",
    "Enter"
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={props.query}
      onChange={(e) => props.setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MoviesList({ movies, handleSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies
          movie={movie}
          key={movie.imdbID}
          handleSelectedMovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}
function Movies({ movie, handleSelectedMovie }) {
  return (
    <li onClick={() => handleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovie({
  seletedId,
  handleCloseMovie,
  handleAddWatch,
  setSelectedId,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [alreadyInList, setAlreadyInList] = useState(false);

  const countRef = useRef(0);
  useEffect(
    function () {
      if (userRating) countRef.current += 1;
    },
    [userRating]
  );
  useKey(handleCloseMovie, "keydown", "Escape");

  function checkIfMovieAlreadyInList() {
    const listIdMovie = watched.map((e) => e.imdbID);
    if (listIdMovie.includes(seletedId)) setAlreadyInList(true);
  }
  // phan duoi nay khong can thiet dung useEffect, thay vao do co the su dung bien de check xem movie da ton tai trong watched list hay chua roi tra ve gia tri, xong dua vao gia tri true or false xuat ra man hinh ==> ranh sua sau
  useEffect(checkIfMovieAlreadyInList, [seletedId, watched]);
  useEffect(
    function () {
      // this useEffect use to change the title of the page
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;
      // khong bao gio xuong duoc duoi dong nay, boi vi khi khong selectedId thi SelectedMovie se khong render ==> khong chay useEffect duoc ==> khong doi title khi selectedId = null (neu muon doi title cua page thi chay len noi khai bao state de thuc hien useEffect listen to selectedId change)
      // cleaseup function comming to solve this promblem
      return function () {
        // this funtion is called cleaseup of effect, will perform when component is unmounted or before effect
        document.title = "popCornMovie";
      };
    },
    [movie, seletedId]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: seletedId,
      imdbRating: +movie.imdbRating,
      userRating: +userRating,
      runtime: movie.Runtime !== "N/A" ? +movie.Runtime.split(" ")[0] : 0,
      Title: movie.Title,
      Poster: movie.Poster,
      countRatingDecisions: countRef.current,
    };
    handleAddWatch(newWatchedMovie);
    setSelectedId(null);
  }
  useEffect(
    function () {
      async function getMovieDetail() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${seletedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetail();
    },
    [seletedId]
  );
  return isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleCloseMovie}>
          &larr;
        </button>
        <img src={movie.Poster} alt={movie.Title} />
        <div className="details-overview">
          <h2>{movie.Title}</h2>
          <p>
            {movie.Released}&bull;{movie.Runtime}
          </p>
          <p>{movie.Genre}</p>
          <p>
            <span>⭐️</span> &nbsp;
            {movie.imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
          {userRating > 0 && !alreadyInList && (
            <button className="btn-add" onClick={handleAdd}>
              Add to watched list
            </button>
          )}
        </div>
        <p>
          <em>{movie.Plot}</em>
        </p>
        <p>Starring: {movie.Actors}</p>
        <p>Directed by: {movie.Director}</p>
      </section>
    </div>
  );
}

function Sumary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovies({ movie, onDeleteWatch }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatch(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}
function WatchedMoviesList({ watched, handleDeleteWatch }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovies
          {...{ movie }}
          key={movie.imdbID}
          onDeleteWatch={handleDeleteWatch}
        />
      ))}
    </ul>
  );
}
