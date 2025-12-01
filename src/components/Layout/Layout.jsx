import React from "react";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom"; // Add this import
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Render nested routes here */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
