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
import Projects  from "./Pages/Projects";
// import About from "./Pages/About";
import { Home } from "./Pages/Home";
import { parseSearchWith, stringifySearchWith } from '@tanstack/router'

// mocking a async fetch function
async function msleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
}

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});
  
function Root() {

  var descOrder = false
  return (
    <div className="flex h-screen">
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
            desc: descOrder,
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

// Create an index route default. Simple Route
const homeRoute = new Route({
  component: Home,
  path: "/",
  getParentRoute: () => rootRoute,
  onLoad: async () => {
    await msleep(2000);
    console.log("Home route loaded onload");
  },
  onLoaded: () => {
    console.log("Home route loaded");
  }
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
  beforeLoad: async () => {
    await msleep(2000);
    // fetch something
    console.log("About route before load");
  },
  validateSearch: (search: Record<string, unknown>): any => {
    // validate and parse the search params into a typed state
    return {
      title: search.title || "PuneFOSS",
      sortBy: search.sortBy || "name",
      desc: search.desc || false,
    };
  },
});

const parentProjectsRoute = new Route({
  getParentRoute: () => rootRoute,
  component: lazy(() => import("./Pages/Projects")),
  path: "/projects",
});


const projectRoute = new Route({
  getParentRoute: () => parentProjectsRoute,
  path: "$projectId",
  component: Projects,
});


function About() {
  const { title, sortBy, desc } = useSearch({ from: aboutRoute.id });

  console.log(title, sortBy, desc);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Notice the URL. It contains our search params (/about)
      </h1>
      <h1>Search Params: {title + " " + sortBy + " " + desc}</h1>
    </div>
  );
}




// Router Tree
/*

  Index Routes
  Static Routes (longest to shortest)
  Dynamic Routes (longest to shortest)
  Splat/Wildcard Routes
*/

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  parentProjectsRoute.addChildren([projectRoute]),
]);

// we dont need to declare router tree in react-router-dom
// but it has some advantages it performs operaitons under the hood 
const router = new Router({
  routeTree: routeTree,
})

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
