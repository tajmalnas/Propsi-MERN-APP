import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  
  const {setUser} = useContext(UserContext);

  const submitHandler = async(e) => {
    e.preventDefault();
    try{ 
      const data = await axios.post('/login',{
        email,
        password,
      },
      );
      setUser(data)
      alert('Login Success')
      setRedirect(true);
    }
    catch(err){
      alert("Login failed")
    }
  }

  if(redirect){
    return <Navigate to="/" />
  }
  
  return (
    <div className="mt-4 grow flex items-center justify-center">
        <div className="mb-32">
            <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto" onSubmit={(e)=>submitHandler(e)}>
                <input type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
                <button className="bg-primary w-full h-8 text-white rounded-full" type="submit">Login</button>
                <div className="p-2">Dont Have an account yet? 
                    <Link to="/register" className="text-primary hover:underline">Register</Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default LoginPage