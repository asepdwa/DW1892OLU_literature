import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../Assets/404.css";

export default function NotFound() {
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    const events = ["resize", "load"];
    events.forEach(function (e) {
      window.addEventListener(e, function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setRatio(45 / (width / height));
      });
    });
  }, []);

  return (
    <div className="notfound">
      <Link to="/">
        <svg
          height="0.8em"
          width="0.8em"
          viewBox="0 0 2 1"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#777777"
            stroke-width="0.1"
            points="0.9,0.1 0.1,0.5 0.9,0.9"
          />
        </svg>{" "}
        Home
      </Link>
      <div class="background-wrapper">
        <h1
          id="visual"
          style={{ transform: `translate(-50%, -50%) rotate(-${ratio}deg)` }}
        >
          404
        </h1>
      </div>
      <p>The page you’re looking for does not exist.</p>
    </div>
  );
}
