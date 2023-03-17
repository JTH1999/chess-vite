import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LogoutRoute() {
    const auth = useAuth();
    const navigate = useNavigate();
    auth.signout();
    navigate("/login");
}
