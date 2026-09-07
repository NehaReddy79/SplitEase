import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../api/auth'
import './Auth.css'

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {

            const res = await login(email, password)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userId', res.data.userId)
            alert('Login successful!')
            navigate('/dashboard')

        } catch (error) {
            alert(error.response?.data?.error || 'Login Failed.')
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
                        <h2>Welcome back</h2>
                        <p className="subtitle">Log in to your account</p>
                        <form onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
                            <button type="submit">Log in</button>
                        </form>
                        <p className="switch-link">Don't have an account? <a href="/signup">Sign up</a></p>
                    </div>
                </div>
            </div>

        </>
    )
}