"use client";
import axios from "axios"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const page = () => {

    const [user, setuser] = useState({
        userName: "",
        email: "",
        password: ""
    })
    const [submitButton, setsubmitButton] = useState(false)
    const [loading, setloading] = useState(false)
    const router = useRouter()

    const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setloading(true)
        setsubmitButton(false)
        const { userName, email, password } = user
        if (!userName || !email || !password) {
            toast.error("Please fill all the fields")
            setloading(false)
            setsubmitButton(false)
            return
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            setloading(false)
            setsubmitButton(true)
            return
        }
        if (!email.includes("@")) {
            toast.error("Please enter a valid email")
            setloading(false)
            setsubmitButton(true)
            return
        }
        try {
            const { data } = await axios.post("/api/user/signup", user)
            if (data.success) {
                toast.success("User created successfully")
                setloading(false)
                setsubmitButton(true)
                router.push("/login")
            } else {
                toast.error(data.message)
                setloading(false)
                setsubmitButton(false)
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
            setloading(false)
            setsubmitButton(true)
        }
    }

    useEffect(() => {
        if (user.userName.length > 0 && user.email.length > 0 && user.password.length > 0) {
            setsubmitButton(true)
        }
        else {
            setsubmitButton(false)
        }
    }, [user])


    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <h2>{loading && "Processing"}</h2>
                <h2>Sign Up</h2>
                <form onSubmit={(e) => onSignup(e)} className="m-2 flex flex-col gap-2">
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={user.userName}
                        onChange={(e) => setuser({ ...user, userName: e.target.value })}
                        required
                        className="p-1"
                    /><br />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => setuser({ ...user, email: e.target.value })}
                        required
                        className="p-1"
                    /><br />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setuser({ ...user, password: e.target.value })}
                        required
                        className="p-1"
                    /><br />
                    <button type="submit" disabled={!submitButton} className="cursor-pointer border rounded-lg">Sign Up</button>
                </form>
                <p className="text-center">
                    Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/login")}>Login</span>
                </p>
            </div>
        </div>
    )
}

export default page