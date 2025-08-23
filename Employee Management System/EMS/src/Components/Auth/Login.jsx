import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault(); // ✅ correct
    console.log("email is:", email)
    console.log("password is:", password)

    setEmail("");
    setPassword("");
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='border-2 rounded-xl border-emerald-600 p-20'>
        <form 
          onSubmit={submitHandler}
          className='flex flex-col items-center justify-center'
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='outline-none bg-transparent border-2 border-emerald-600 text-xl py-3 px-5 rounded-full placeholder:text-gray-400'
            type="email"
            placeholder='enter your email'
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='outline-none bg-transparent border-2 border-emerald-600 text-xl py-3 px-5 rounded-full placeholder:text-gray-400 mt-4'
            type="password"
            placeholder='enter password'
          />
          <button
            type="submit"
            className='bg-emerald-600 text-white text-xl py-3 px-5 rounded-full mt-5'
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
