import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense, type ReactNode } from "react"
import { useAuth } from "../context/authContext"
import Layout from "../components/Layout"

const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const Welcome = lazy(() => import("../pages/Welcome"))
const Post = lazy(() => import("../pages/Post"))
const MyPost = lazy(() => import("../pages/MyPost"))

type RequireAuthTypes = { children: ReactNode; mahen:string }

const RequireAuth = ({ children, mahen }: RequireAuthTypes) => {
  const { user, loading } = useAuth()
  if (loading) {
    return <div>User Loading...</div>
  }
  if(!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* <RequireAuth mahen=""><div></div></RequireAuth> */}
          {/* <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Welcome />} />
          <Route element={<RequireAuth mahen=""><Layout /></RequireAuth>}>
            <Route path="/home" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route path="/mypost" element={<MyPost/>}></Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}