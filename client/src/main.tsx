import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import { ProvideAuth, useAuth } from "./hooks/useAuth";
import "./index.css";
import Login from "./routes/login";
import Home from "./routes/home";
import LocalMatchRoute, {
  loader as localMatchLoader,
} from "./routes/localMatch";
import OnlineMatchRoute from "./routes/playOnline";
import Root from "./routes/root";
import VsComputerRoute from "./routes/vsComputer";
import theme from "./theme";
import { LogoutRoute } from "./routes/logout";
import { MyGamesRoute, loader as myGamesLoader } from "./routes/myGames";
import { AnalysisRoute } from "./routes/analysis";
import { ProvideColour } from "./hooks/useColour";
import { ProfileRoute, loader as profileLoader } from "./routes/Profile";
import React from "react";
import ComingSoon from "./components/ComingSoon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/local-match",
        element: <LocalMatchRoute />,
        loader: localMatchLoader,
      },
      {
        path: "/vs-computer",
        element: <VsComputerRoute />,
        loader: localMatchLoader,
      },
      {
        path: "/online-match",
        element: <OnlineMatchRoute />,
      },
      {
        path: "/my-games",
        element: <MyGamesRoute />,
        loader: myGamesLoader,
      },
      {
        path: "/analysis/:gameId",
        element: <AnalysisRoute />,
        loader: async ({ params }) => {
          const tokenString = localStorage.getItem("token");
          const userToken = tokenString ? JSON.parse(tokenString) : null;
          return await fetch(
            import.meta.env.VITE_CHESS_API_ENDPOINT +
              `users/games/${params.gameId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
        },
      },
      {
        path: "/profile",
        element: <ProfileRoute />,
        loader: profileLoader,
      },
      {
        path: "/friends",
        element: <ComingSoon />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <LogoutRoute />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ProvideAuth>
        <ProvideColour>
          <RouterProvider router={router} />
        </ProvideColour>
      </ProvideAuth>
    </ChakraProvider>
  </React.StrictMode>
);
