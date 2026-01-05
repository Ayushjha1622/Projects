import React from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount } from './redux/features/counterSlice';
import { useState } from 'react';



function App() {

  const dispatch = useDispatch();
  const count = useSelector((state)=> state.counter.value);
  const[num, setNum] = useState(5); 
 

  return (
   <div>
    <h1>{count}</h1>

    <button  onClick={() => {dispatch(increment())}}>Increment</button>
    <button onClick={()=> {dispatch(decrement())}}>Decrement</button>
    
    <button onClick={()=> {dispatch(incrementByAmount(Number(num)))}}>Increase by amount</button>


    <input type="number" value={num} onChange={(e)=>{
      setNum(e.target.value);
      
    }} />
   </div>
  )
}

export default App
