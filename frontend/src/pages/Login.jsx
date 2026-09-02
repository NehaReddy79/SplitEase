import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from '../api/auth'

export function Login(){
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        try{

            const res = await login(email, password)
            localStorage.setItem('token' , res.data.token)
            localStorage.setItem('userId', res.data.userId)
            alert('Login successful!')
            navigate('/dashboard')

        }catch(error){
            alert(error.response?.data?.error || 'Login Failed.')
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}></input>
                <input type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}