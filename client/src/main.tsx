import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import ErrorPage from "./error-page";
import { ProvideAuth } from "./hooks/useAuth";
import "./index.css";
import Login from "./routes/login";
import Home from "./routes/home";
import LocalMatchRoute from "./routes/localMatch";
import OnlineMatchRoute from "./routes/playOnline";
import Root, { loader as rootLoader } from "./routes/root";
import VsComputerRoute from "./routes/vsComputer";
import theme from "./theme";
import { LogoutRoute } from "./routes/logout";
import SocketTest from "./routes/socketTest";
import { BoardTest } from "./routes/boardTest";

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
            },
            {
                path: "/vs-computer",
                element: <VsComputerRoute />,
            },
            {
                path: "/online-match",
                element: <OnlineMatchRoute />,
            },
            {
                path: "/socket-test",
                element: <SocketTest />,
            },
            {
                path: "/boardtest",
                element: <BoardTest />,
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
    // <React.StrictMode>
    <ChakraProvider theme={theme}>
        <ProvideAuth>
            <RouterProvider router={router} />
        </ProvideAuth>
    </ChakraProvider>
    // {/* </React.StrictMode> */}
);
