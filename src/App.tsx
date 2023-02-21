import React, { lazy, StrictMode } from "react";

import {
  Outlet,
  RouterProvider,
  Link,
  ReactRouter,
  Route,
  RootRoute,
  Router,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { Projects } from "./Pages/Projects";
import About from "./Pages/About";
import { Home } from "./Pages/Home";

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="flex h-screen jc">
      <div className="flex flex-col gap-24 items-center justify-center h-screen w-1/4 bg-slate-600">
        <Link to="/" className="bg-gray-400 p-4">
          Home
        </Link>

        <Link
          to="/about"
          className="bg-gray-400 p-4"
          search={{
            title: "TanStack",
            sortBy: "name",
            desc: true,
          }}
        >
          About
        </Link>

        <Link
          to="/projects/$projectId"
          className="bg-gray-400 p-4"
          params={{
            projectId: "my-first-blog-post",
          }}
        >
          Projects
        </Link>
      </div>
      <hr />
      <div className="flex justify-center items-center w-full">
        <Outlet />
      </div>
    </div>
  );
}

// Create an index route
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const projectsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/projects",
});

// Route with a dynamic parameter
const projectRoute = new Route({
  getParentRoute: () => projectsRoute,
  path: "$projectId",
  component: Projects,
});

// Router Tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  projectsRoute.addChildren([projectRoute]),
]);

const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <div>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </div>
  );
}
