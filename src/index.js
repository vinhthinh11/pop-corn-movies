import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color={"blue"} maxRating={10} onSetRating={setMovieRating} />
      <span>This movies was rated {movieRating} start</span>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10} />
    <StarRating
      maxRating={4}
      color={"red"}
      size={40}
      className={"test"}
      message={["bad", "normal", "good", "amazing"]}
      defaultRating={2}
    />
    <Test /> */}
  </React.StrictMode>
);
