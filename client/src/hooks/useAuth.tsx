import { createContext, useContext, useState } from "react";
// import useToken from "./useToken";

export const authContext = createContext();

export function useAuth() {
    return useContext(authContext);
}

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    return userToken;
};

const setToken = (token: string) => {
    localStorage.setItem("token", JSON.stringify(token));
};

const clearToken = () => {
    localStorage.clear();
};

export function useProvideAuth() {
    // const { token, setToken, clearToken } = useToken();
    const [user, setUser] = useState(null);

    const signup = async (
        username,
        password,
        setIsSubmitting,
        setError,
        genericErrorMessage
    ) => {
        const response = await fetch(
            import.meta.env.VITE_CHESS_API_ENDPOINT + "users/signup",
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        ).catch((error) => {
            setIsSubmitting(false);
            setError(genericErrorMessage);
        });

        if (!response.ok) {
            if (response.status === 400) {
                setError("Please fill all the fields correctly!");
            } else if (response.status === 401) {
                setError("Invalid email and password combination.");
            } else if (response.status === 500) {
                const data = await response.json();
                if (data.message) setError(data.message || genericErrorMessage);
            } else {
                setError(genericErrorMessage);
            }
            return false;
        }

        const data = await response.json();
        setUser({
            username: data.username,
        });
        setToken(data.token);
        return true;
    };

    const signin = async (
        username,
        password,
        setIsSubmitting,
        setError,

        genericErrorMessage
    ) => {
        const response = await fetch(
            import.meta.env.VITE_CHESS_API_ENDPOINT + "users/login",
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );

        if (!response.ok) {
            {
                if (response.status === 400) {
                    setError("Please fill all the fields correctly!");
                } else if (response.status === 401) {
                    setError("Invalid email and password combination.");
                } else {
                    setError(genericErrorMessage);
                }

                return false;
            }
        }

        const data = await response.json();
        setUser({
            username: data.username,
        });
        setToken(data.token);
        return true;
    };

    const signout = () => {
        setUser(false);
        clearToken();
    };

    const getUser = async () => {
        const response = await fetch(
            import.meta.env.VITE_CHESS_API_ENDPOINT + "users/getUser",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );

        if (!response.ok) {
            setUser(false);
            clearToken();
            return false;
        }

        const data = await response.json();
        setUser({ username: data.username });
        setToken(data.token);
        return true;
    };

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    // useEffect(() => {
    //     const unsubscribe = (user) => {
    //         if (user) {
    //             setUser(user);
    //         } else {
    //             setUser(false);
    //         }
    //     };
    //     // Cleanup subscription on unmount
    //     return () => unsubscribe();
    // }, []);

    return {
        user,
        signup,
        signin,
        signout,
        getUser,
        getToken,
    };
}
