import { useState } from "react";
import { signup } from "../api/auth";
import {useNavigate} from 'react-router-dom'

export function Signup(){
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        try{
            const res = await signup(name , email , password)
            alert("Registered successfully! Please login.")
            navigate('/login')
        }catch(error){
            alert(error.response?.data?.error || 'Registration failed!')
        }
        
    }
    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => {setName(e.target.value)}}></input>
                <input type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}></input>
                <input type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}