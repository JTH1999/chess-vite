import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = tokenString ? JSON.parse(tokenString) : null;
        return userToken?.token;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (token: string) => {
        localStorage.setItem("token", JSON.stringify(token));
        // setToken(userToken.token);
    };

    const clearToken = () => {
        localStorage.clear();
    };

    return {
        setToken: saveToken,
        clearToken,
        token,
    };
}
