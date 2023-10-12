import { useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'
const RegisterPage = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const register = async (e) => {
        e.preventDefault()
       try{
        await axios.post('/register',{
            name,
            email,
            password,
        });
        alert('Register Success')
       }catch(err){
           alert("register failed")
       }

    }

  return (
    <div className="mt-4 grow flex items-center justify-center">
        <div className="mb-32">
            <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto " onSubmit={register}>
                <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
                <button className="bg-primary w-full h-8 text-white rounded-full" type="submit">Register</button>
                <div className="p-2">Already Have an account yet? 
                    <Link to="/login" className="text-primary hover:underline">Login</Link>
                </div>
            </form>
        </div>
    </div>
    )
}

export default RegisterPage