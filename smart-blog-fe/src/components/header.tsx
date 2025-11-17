import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const handleLogin = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/login")
    }
    return (
        <header className="bg-blue-500 text-white justify-between items-center">
            <div className="flex space-x-4">
                <Link to={"/home"} className="hover:underline">Home</Link>
                <Link to={"/post"} className="hover:underline">Post</Link>
            </div>
            <div  className="flex items-center space-x-4">
                <button onClick={handleLogin}  className="bg-white text-blue-500 px-3 py-1 rounded">Logout</button>
            </div>
        </header>
    )
}