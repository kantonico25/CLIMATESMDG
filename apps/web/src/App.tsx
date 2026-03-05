import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import RouteLoader from "./components/loading/RouteLoader";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";

const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const EmissionsPage = lazy(() => import("./pages/EmissionsPage"));
const PageBySlug = lazy(() => import("./pages/PageBySlug"));

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="emissions" element={<EmissionsPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="projets/:slug" element={<ProjectDetailPage />} />
          <Route path=":slug" element={<PageBySlug />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
