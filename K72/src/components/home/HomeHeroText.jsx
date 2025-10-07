import React from 'react'
import Video from './video'

const HomeHeroText = () => {
  return (
    <div className='font-[font1] pt-5 text-center'>
       <div className='text-[9.5vw] uppercase flex justify-center items-center leading-[8vw]'>L'étincelle</div>
       <div className='text-[9.5vw] uppercase flex-start  leading-[8vw] flex justify-center items-center'> qui <div className='h-[7vw] rounded-full overflow-hidden -mt-3 '><Video/></div> génère</div>
       <div className='text-[9.5vw] flex justify-center items-center uppercase leading-[8vw]'> la créativité</div>
      
    </div>
  )
}

export default HomeHeroText
