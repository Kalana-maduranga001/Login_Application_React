import { createContext, useContext, useEffect, useState } from "react";
import { getMyDetails } from "../services/auth";

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
        getMyDetails()
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                setUser(null)
                console.error(err)
            })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}