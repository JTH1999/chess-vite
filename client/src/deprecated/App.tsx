import { BrowserRouter as Router, Routes, Route, json } from "react-router-dom";

import Home from "./pages/home";
import PlayOnlineRoute from "./pages/playOnline";
import VsComputerRoute from "./pages/vsComputer";
import LocalMatchRoute from "./pages/localMatch";
import { useCallback, useContext, useEffect, useState } from "react";
import Login from "./pages/login";
import useToken from "./useToken";
import { UserContext, UserProvider } from "./context/UserContext";
import { useConst } from "@chakra-ui/react";
import { ProvideAuth } from "../hooks/useAuth";

function App() {
  const [userContext, setUserContext] = useContext(UserContext);
  const { token, setToken } = useToken();

  // const quotesToken = localStorage.getItem("token");
  // console.log("quotesToken: " + quotesToken);
  // const strippedToken = quotesToken?.slice(1, quotesToken.length - 1);
  // console.log("strippedToken: " + strippedToken);

  // const verifyUser = useCallback(() => {
  //     // console.log(token);
  //     console.log("refreshToken: " + localStorage.refreshToken);
  //     fetch(import.meta.env.VITE_CHESS_API_ENDPOINT + "users/refreshToken", {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${strippedToken}`,
  //         },
  //         body: JSON.stringify({
  //             token: localStorage.refreshToken,
  //         }),
  //     }).then(async (response) => {
  //         if (response.ok) {
  //             const data = await response.json();
  //             setUserContext((oldValues) => {
  //                 return { ...oldValues, token: data.token };
  //             });
  //             setToken(data.token);

  //             localStorage.setItem("refreshToken", data.refreshToken);
  //         } else {
  //             setUserContext((oldValues) => {
  //                 return { ...oldValues, token: null };
  //             });
  //             setToken(null);
  //             localStorage.setItem("refreshToken", null);
  //         }
  //         // call refreshToken every 5 minutes to renew the authentication token.
  //         setTimeout(verifyUser, 5 * 60 * 1000);
  //     });
  // }, []);

  // useEffect(() => {
  //     verifyUser();
  // }, [verifyUser]);

  // return userContext.token === null ? (
  //     <Login setToken={setToken} />
  // ) : userContext.token ? (
  //     <ProvideAuth>
  //         <Router>
  //             <Routes>
  //                 <Route path="/" element={<Home />} />
  //                 <Route path="/local-match" element={<LocalMatchRoute />} />
  //                 <Route path="/vs-computer" element={<VsComputerRoute />} />
  //                 <Route path="/play-online" element={<PlayOnlineRoute />} />
  //                 <Route
  //                     path="/login"
  //                     element={<Login useAuth={useAuth} />}
  //                 />
  //             </Routes>
  //         </Router>
  //     </ProvideAuth>
  // ) : (
  //     <></>
  // );

  return (
    <ProvideAuth>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local-match" element={<LocalMatchRoute />} />
          <Route path="/vs-computer" element={<VsComputerRoute />} />
          <Route path="/play-online" element={<PlayOnlineRoute />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ProvideAuth>
  );
}

export default App;
