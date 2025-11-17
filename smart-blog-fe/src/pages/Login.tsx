import React, { useState, type FormEvent } from "react"
import { login, getMyDetails } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {

  const { setUser} = useAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res:any = await login(email, password)
      console.log(res.data)
      
      if (!res.data.accessToken) {
         alert("Login Failed")
         return
      }

      localStorage.setItem("accessToken", res.data.accessToken)
      localStorage.setItem("refreshToken", res.data.refreshToken)
      // cookieStore.set("accessToken", res.data.accessToken)

      const detail = await getMyDetails()

      setUser(detail.data)

      console.log(detail.data)
      navigate("/home")

      alert(`Login successful! Email: ${res?.data?.email}`)
      navigate("/home")

    } catch (error: any) {
      console.error(error?.response?.data || "Login failed");
    }
  }

  return (
    <div>
      <h1>Login as User or Author</h1>
      <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <input type="password" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}