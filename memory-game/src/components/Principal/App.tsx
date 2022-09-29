import { useState } from 'react'
import MemoryGame from '../GameContainer/MemoryGame'
import './App.scss'

function App() {

  return (
    <div className="App">
      <div className='GameTitle'>
        <h1>Memory Game</h1>
      </div>
      <MemoryGame />
    </div>
  )
}

export default App
