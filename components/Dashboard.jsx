'use client'
import { Fugaz_One } from 'next/font/google'
import React, { useEffect, useState } from 'react'
import Calender from './Calender'
import { useAuth } from '@/context/AuthContext'
import {  doc, setDoc } from 'firebase/firestore'
import Loading from './Loading'
import Login from './Login'
import { db } from '@/firebase'

const fugaz= Fugaz_One({
  subsets: ["latin"],
  weight:['400']
})

export default function Dashboard() {

  const {currentUser,userDataObj,setUserDataObj,loading} = useAuth()
  const [data,setData] = useState()
  const now = new Date()
  

  function calculateValues(){
    let total_number_of_days = 0
    let sum_moods = 0
    for(let year in data){
      for(let month in data[year]){
        for(let day in data[year][month]){
          let days_mood = data[year][month][day]
          total_number_of_days++
          sum_moods += days_mood
        }
      }
    }
    return { num_days:total_number_of_days, average_mood: sum_moods/total_number_of_days || 0}
  }

  const statuses ={
    ...calculateValues(),
    time_remaining:   `${23-now.getHours()}H:${60-now.getMinutes()}M`,
    
  }

  
  async function handleSetMood(mood){
   
      const day = now.getDate()
      
      const month= now.getMonth()
      const year = now.getFullYear()
      try{
        const newData = {...userDataObj}
        if(!newData?.[year]){
          newData[year]={}
        }
        if(!newData?.[year]?.[month]){
          newData[year][month]={}
        }
        newData[year][month][day]=mood

        setData(newData)
        setUserDataObj(newData)
        const docRef = doc(db,'users',currentUser.uid)
        const res = await setDoc(docRef, {
          [year]: {
            [month]: {
              [day]: mood
            }
          }
        }, { merge: true })
      }catch(err){
        console.log("failed to set data",err.message)
      }

  }


  const moods ={
    '&@*$#':'😭',
    'Sad':'😢',
    'Existing':'😶',
    'Good':'😊',
    'Elated':'😍'
  }

  useEffect(()=>{
    if(!currentUser || !userDataObj){
      return
    }
    setData(userDataObj)
  })


  if(loading){
      return <Loading />
    
  }
  if(!currentUser){
    return <Login />
  }


  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>

      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg p-4 gap-4 '>
        {Object.keys(statuses).map((status,statusIndex)=>{
            return(
              <div key={statusIndex} className=' flex flex-col gap-1 sm:gap-2  '>
                <p className='capitalize font-medium text-xs sm:text-sm truncate'>{status.replaceAll('_',' ')}</p>
                <p className={'text-base sm:text-lg truncate ' + fugaz.className }>{statuses[status]}{status==='num_days'?'🔥':''}</p>
              </div>
            )
        })}
      </div>

      <h4 className={' text-4xl sm:text-5xl md:text-6xl text-center ' + fugaz.className }>How do you <span className='textGradient'>feel</span> today? </h4>
      
      <div className=' flex flex-wrap items-stretch gap-4 '>
        {Object.keys(moods).map((mood,moodIndex)=>{
            return(
              <button onClick={()=>{
                const currentMoodValue = moodIndex + 1
                handleSetMood(currentMoodValue)
              }} className={' p-4 px-5 rounded-lg purpleShadow bg-indigo-50 duration-200  hover:bg-indigo-100 flex flex-col gap-3 items-center flex-1 '} key={moodIndex}>   
                  <p className=' text-4xl sm:text-5xl md:text-6xl '>{moods[mood]}</p>
                  <p className={' text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className }>{mood}</p>        
              </button>
            )
        })}
      </div>
      <Calender completeData={data} handleSetMood={handleSetMood} />
    </div>
  )
}
