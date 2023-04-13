import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext, User } from "../../types";

const getToken = () => {
  const tokenString = localStorage.getItem("token");
  const userToken: string | null = tokenString ? JSON.parse(tokenString) : null;
  return userToken;
};

const setToken = (token: string) => {
  localStorage.setItem("token", JSON.stringify(token));
};

const clearToken = () => {
  localStorage.removeItem("token");
};

export const authContext = createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(authContext);
}

export function authProvider() {
  const [user, setUser] = useState<User>({ username: null });

  const validate = (
    username: string,
    password: string,
    setUsernameError: Dispatch<SetStateAction<string>>,
    setPasswordError: Dispatch<SetStateAction<string>>
  ) => {
    let errors = false;
    if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters");
      errors = true;
    } else {
      setUsernameError("");
    }
    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      errors = true;
    } else {
      setPasswordError("");
    }
    return errors;
  };

  const signup = async (
    username: string,
    password: string,
    setIsSubmitting: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string>>,
    setUsernameError: Dispatch<SetStateAction<string>>,
    setPasswordError: Dispatch<SetStateAction<string>>,
    genericErrorMessage: string
  ) => {
    if (validate(username, password, setUsernameError, setPasswordError)) {
      return false;
    }

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

    if (response) {
      if (!response.ok) {
        if (response.status === 400) {
          const errors = await response.json();
          console.log(errors);
          setUsernameError(errors.usernameError);
          setPasswordError(errors.passwordError);
          setError(errors.generalError);
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
    }
  };

  const signin = async (
    username: string,
    password: string,
    setIsSubmitting: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string>>,
    genericErrorMessage: string
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
    setUser({ username: null });
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
      setUser({ username: null });
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
  useEffect(() => {
    const unsubscribe = (user: User) => {
      if (user) {
        setUser(user);
      } else {
        setUser({ username: null });
      }
    };
    // Cleanup subscription on unmount
    return () => unsubscribe(user);
  }, []);

  return { user, validate, signup, signin, signout, getUser, getToken };
}

export function ProvideAuth({ children }: { children: ReactNode }) {
  return (
    <authContext.Provider value={authProvider()}>
      {children}
    </authContext.Provider>
  );
}
