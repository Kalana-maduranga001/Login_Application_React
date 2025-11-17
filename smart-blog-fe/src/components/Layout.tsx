import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function Layout() {
    return (    
        <div className="min-h-screen flex flex-col bg-gray-500">
            <Header />
            <main className="flex-1 container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;