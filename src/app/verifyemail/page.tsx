"use client";
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios"

const page = () => {

    const searchParams = useSearchParams();
    // const {query}:any = router
    // const {token, email} = searchParams
    // const { token, email } = searchParams;
    const token = searchParams.get("token")
    const email = searchParams.get("email")
    const [isQueryFound, setisQueryFound] = useState(false)

    const onverifyUser = async () => {
        try {
            const res = await axios.post("/api/user/verifyUser", {
                email,
                token
            })
            if (res.data.success) {
                toast.success(res.data.message)
                // router.push("/login")
            } else {
                toast.error(res.data.message)
            }
        } catch (error:any) {
            console.error("Error verifying user:", error);
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (!email && !token) {
            toast.error("Token or email not found")
            console.log("Token or email not found")
            setisQueryFound(false)
        }
        else {
            toast.success("Token and email found")
            setisQueryFound(true)
        }
    }, [email, token])

    const onsubmit = ()=>{
        if (isQueryFound) {
            onverifyUser()
        } else {
            toast.error("Token or email not found")
        }
    }

  return (
    <div>
        <div><Toaster/></div>
        <div className="flex flex-col w-full h-full justify-center items-center">
            <h1 className="text-2xl font-bold">Verify Email</h1>
            <p className="text-lg">Click the button below to verify your email</p>
            <button onClick={onsubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Verify Email</button>
        </div>
    </div>
  )
}

export default page