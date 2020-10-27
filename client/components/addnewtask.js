import React, { useState, useEffect } from 'react'

const AddNewTask = ({ newTaskTitle, sendNewTask }) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue('')
  }, [newTaskTitle])

  return (
    <div className="flex flex-row border-2 w-full bg-blue-200 text-xl justify-between items-center">
      <span className="flex font-bold px-2">New task:</span>
      <input
        className="flex flex-grow border-2 border-black"
        placeholder="Enter task name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="flex m-1 mr-2 px-1 bg-gray-500"
        type="button"
        onClick={() => sendNewTask(inputValue)}
      >
        Add
      </button>
    </div>
  )
}

export default React.memo(AddNewTask)
