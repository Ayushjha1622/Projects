import React, { useState, useContext } from 'react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../Context/UserContext'
import axios from 'axios'


const UserLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[userData, setUserData] = useState({})

    const {user,setUser} = useContext(UserDataContext)


    const navigate = useNavigate();


    const submitHandler =async (e) => {
        e.preventDefault();
         const userData = {
         email,  
         password
         }
         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

         if(response.status === 200){
            const data = response.data
            localStorage.setItem('token', data.token);
            navigate('/home')
         }
         setEmail('');
        setPassword('');
        
        
    }
  return (
   <div>
     <div className='p-7 h-screen flex flex-col justify-between' >
       <div>
        <img className='w-23 mb-6' src="https://imgs.search.brave.com/IU_TLefoooDrtquOHcNiqkLkypZuVxRx3shEg35Myy4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP3E9dWJlcits/b2dvK3BuZw" alt="image" /> 
     <form action="" onSubmit={(e)=>{submitHandler(e)}}>
         <h3 className='text-lg font-medium mb-2'>What's your email</h3>
         <input  required className='bg-[#eeeeee] mb-7  rounded px-4 py-2 w-full text-lg placeholder:text-base' type="email"  placeholder='Your email' value={email} onChange={(e)=>{
            setEmail(e.target.value)
            
         }}/>
         <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
         <input className='bg-[#eeeeee] mb-7  rounded px-4 py-2  w-full text-lg placeholder:text-base' required type="password" placeholder='Your password' value={password} onChange={(e)=>{
            setPassword(e.target.value)
         } }/>
         <button className='bg-[#111] mb-3  font-semibold rounded px-4 py-2 w-full text-lg text-white placeholder:text-base' type='submit'>Login</button>
         
         <p className='text-center'>New Here ?<Link to="/signup" className='text-blue-600'>{" "}Create New Account</Link></p>


     </form>
       </div>

       <div>
        <Link to='/Captain-Login' className='bg-[#10b461] flex items-center justify-center font-semibold rounded px-4 py-2 w-full text-lg text-white placeholder:text-base mb-5' type='submit'>Sign in as Captain</Link>
       </div>

    </div>
   </div>
  )
}

export default UserLogin
