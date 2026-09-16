import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Guess from "../pages/guess/Guess";
import About from "../pages/about/About";
import Landing from "../pages/landing/Landing";
import Home from "../pages/Home/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Landing />} /> */}
        {/* <Route path="/guess" element={<Guess />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
