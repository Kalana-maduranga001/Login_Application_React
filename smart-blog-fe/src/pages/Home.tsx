import { useAuth } from "../context/authContext";

export default function Home() {
  const { user } = useAuth()
  return (
    <div>
      <h1>{user.email}</h1>
    </div>
  )
}