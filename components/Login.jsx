'use client'
import React, { useState } from 'react'
import Button from './Button'
import { Fugaz_One } from 'next/font/google'
import { useAuth } from '@/context/AuthContext'

const fugaz= Fugaz_One({
  subsets: ["latin"],
  weight:['400']
})

export default function Login() {
  const [email,setEmail]= useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const[isRegister,setIsRegister]=useState(true)
  const [authenticating,setAuthenticating]=useState(false)
  const { signup,login }= useAuth()

  async function handleSubmit(){
    
      if(!email || !password || password.length<6){
        console.log(" password length should be greater than 6")
        setError("password length should be greater than 6")
        return
      }

    setAuthenticating(true)
    try{
    if (isRegister){
      console.log('Signing up a new user')
      await signup(email,password)
      setError(null)
    }else{
      console.log("Logging in existing user")
      await login(email,password)
      setError(null)
    }}catch(err){
      console.log(err.message)
      setError(err.message)
    }finally{
      setAuthenticating(false)
    }
  }


  return (
    <div className='flex flex-col flex-1 items-center justify-center gap-4 '>
        
        <h3 className={' text-4xl sm:text-5xl md:text-6xl ' + fugaz.className }>{isRegister ? 'Register' : 'Log In'}</h3>
        <p>You&apos;re one step away!</p>
        <input value={email} onChange={(e)=>{
          setEmail(e.target.value)
        }} className='max-w-[400px] w-full mx-auto px-3 py-2 sm:py-3 rounded-full border border-solid outline-none border-indigo-400 duration-200 hover:border-indigo-600 focus:border-indigo-600 transition-all'placeholder='Email' type='email' />
        <input value={password} onChange={(e)=>{
          setPassword(e.target.value)
        }} className='max-w-[400px] w-full mx-auto px-3 py-2 sm:py-3 rounded-full border  border-solid outline-none border-indigo-400 duration-200 hover:border-indigo-600 focus:border-indigo-600 transition-all' placeholder='Password' type='password'/>
        {error && (<p>❌{error.replace('Firebase:','')}</p>)}
        <div className='max-w-[400px] w-full mx-auto'>
          <Button clickHandler={handleSubmit} text={authenticating?'Submitting':'Submit'} full />
        </div>
        <p className='text-center'>{(isRegister? 'Already have an account?':"Don't have an account?")}<button onClick={()=>{
          setIsRegister(!isRegister)
        }} className='text-indigo-600 px-2'>{(isRegister?'Sign In':'Sign Up')}</button></p>
        
    </div>
  )
}
