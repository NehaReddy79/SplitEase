import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from 'react-router-dom'
import './Auth.css'

export function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await signup(name, email, password)
            alert("Registered successfully! Please login.")
            navigate('/login')
        } catch (error) {
            alert(error.response?.data?.error || 'Registration failed!')
        }

    }
    return (
        <>
            <div className="auth-page">
                <div className="auth-branding">
                    <h1>SplitEase</h1>
                    <p>Split expenses with friends , track balances, and settle up </p>
                    <div className="auth-feature-list">
                        <div><span className="dot"></span> Track shared expenses effortlessly</div>
                        <div><span className="dot"></span> Auto-simplified group settlements</div>
                        <div><span className="dot"></span> Real-time balance updates</div>
                    </div>
                </div>
                <div className="auth-form-side">
                    <div className="auth-form-box">
                        <h2>Hello</h2>
                        <p className="subtitle">Create an account</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Name" value={name} onChange={(e) => { setName(e.target.value) }}></input>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
                            <button type="submit">Sign up</button>
                        </form>

                        <p className="switch-link">Already have an account? <a href="/login">Login</a></p>
                    </div>
                </div>


            </div>

        </>
    )
}