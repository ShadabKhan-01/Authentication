"use client";
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const page = () => {

  const [user, setuser] = useState({
    userName: "",
    email: "",
  });
  const router = useRouter()

  const [loading, setloading] = useState(false)

  const getData = async () => {
    setloading(true);
    try {
      const { data } = await axios.post("/api/user/me")
      if (data.success) {
        setuser(data.data)
        setloading(false)
        toast.success("User Found")
      } else {
        toast.error(data.message)
        setloading(false)
        console.log(data)
      }

    }
    catch (error: any) {
      toast.error(error.response?.data?.message)
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const logout = async () => {
    setloading(true);
    try {
      const { data } = await axios.get("/api/user/logout")
      if (data.success) {
        toast.success(data.message);
        setloading(false);
        router.push("/login");
      } else {
        toast.error(data.message)
        setloading(false)
        console.log(data)
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message)
      console.log(error) 
    }
  }

  return (
    <div>
      <div><Toaster /></div>
      <h1 className='text-3xl font-bold'>Profile</h1>
      <p className='text-lg'>This is the profile page</p>
      {loading ? <p>Loading...</p> : (
        <div>
          <h2 className='text-2xl font-bold'>User Details</h2>
          {user && (
            <div>
              <p><strong>Name:</strong> {user.userName}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}
        </div>
      )}
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={logout}>Logout</button>
    </div>
  )
}

export default page