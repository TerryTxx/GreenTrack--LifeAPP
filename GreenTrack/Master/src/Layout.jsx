import React from "react";
import {Outlet} from "react-router-dom";
import FooterNav from "./Pages/Footer/Footer";

const Layout = () => {
  return (
    <>
      <Outlet />
      <FooterNav />
    </>
  );
};

export default Layout;