// 404Page.js
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="d-flex flex-column mt-5 mt-md-1  ">
      <img
        src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569_960_720.jpg" // Replace with your 404 image URL
        alt="404 Not Found"
        className="mx-auto w-50 opacity-50 mt-1"
      />
      <h1 className="text-center">
        404 - Not Found
      </h1>
      <p className="text-center">
        The page you are looking for might be under construction or doesn't
        exist.
      </p>
      <Link
        to="/"
        className="text-center fs-5"
      >
        Go back to the home page
      </Link>
    </div>
  );
};

export default PageNotFound;
