import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import ContactPage from "./ContactPage/ContactPage";
import ArticlePage from "./Articles/ArticlePage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
    </Routes>
  );
};

export default AppRoutes;
