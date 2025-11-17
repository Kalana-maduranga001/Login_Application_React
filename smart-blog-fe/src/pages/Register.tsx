import axios from "axios";
import React, { useState, type FormEvent } from "react"
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER")

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password || !confirmPassword || !role) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const obj = {
        firstname,
        lastname,
        email,
        password,
        role
      }

      const res:any = await register(obj)
      console.log(res.data)
      console.log(res.message)

      alert(`Registration successful! Email: ${res?.data?.email}`)
      navigate("/login")

      // const response = await axios.post(
      //   "http://localhost:5000/api/v1/auth/register",
      //   {
      //     firstname,
      //     lastname,
      //     email,
      //     password,
      //     role
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json"
      //     }
      //   }
      // )
    } catch (error: any) {
      console.error(error?.response?.data || "Registration failed");
    }
  }

  return (
    <div>
      <h1>Register as User or Author</h1>
      <input type="text" placeholder="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
      <input type="text" placeholder="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)}/>
      <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <input type="password" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
      <input type="text" placeholder="role" value={role} onChange={(e) => setRole(e.target.value)}/>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}