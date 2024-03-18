import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavbarComp from "./components/NavbarComp";
import FooterComp from "./components/FooterComp";
import SignUp from "./pages/SignUp";
import PriviateComp from "./components/PriviateComp";
import Products from "./pages/Products";
import AddAProduct from "./pages/AddAProduct";
import Login from "./pages/Login";
import UpdateAProduct from "./pages/UpdateAProduct";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import EmailLink from "./pages/EmailLink";

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

const App = () => {
  const [flag, setFlag] = useState(false);
  return (
    <div className="layout_div">
      <BrowserRouter>
        <NavbarComp setFlag={setFlag} flag={flag} />
        <Routes>
          <Route element={<PriviateComp />}>
            <Route path="/products" element={<Products />} />
            <Route path="/addaproduct" element={<AddAProduct />} />
            <Route path="/updateaproduct/:id" element={<UpdateAProduct />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Home />} />

          <Route
            path="/signup"
            element={<SignUp setFlag={setFlag} flag={flag} />}
          />
          <Route
            path="/login"
            element={<Login setFlag={setFlag} flag={flag} />}
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/api/user/reset/:id/:token" element={<EmailLink />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <FooterComp />
      </BrowserRouter>
    </div>
  );
};

export default App;
