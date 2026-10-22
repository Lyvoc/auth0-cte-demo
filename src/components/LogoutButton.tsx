import { useAuth0 } from "@auth0/auth0-react";
import { performFullLogout } from "../utils/clearSession";

const LogoutButton = () => {
    const { logout } = useAuth0();
    return (
        <button
            onClick={() => performFullLogout(logout)}
            className="button logout"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;