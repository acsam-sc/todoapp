import React, { useState, useEffect } from 'react'

const AddNewTask = ({ newTaskTitle, sendNewTask }) => {
  const [inputValue, setInputValue] = useState('')

  const handleOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendNewTask(inputValue)
    }
  }

  useEffect(() => {
    setInputValue('')
  }, [newTaskTitle])

  return (
    <div className="flex flex-row p-2 px-2 md:px-4 m-2 border-2 rounded-md md:text-xl text-sm font-semibold justify-between bg-white">
      <input
        className="flex flex-grow min-w-0 border-2 rounded border-gray-500"
        placeholder="Enter new task name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => handleOnKeyPress(e)}
      />
      <button
        className="flex ml-2 px-1 rounded md:text-sm bg-gray-300 items-center"
        type="button"
        onClick={() => sendNewTask(inputValue)}
      >
        Add
      </button>
      <button
        className="flex ml-2 px-1 rounded md:text-sm bg-gray-300 items-center"
        type="button"
        onClick={() => {
          setInputValue('')
        }}
      >
        Cancel
      </button>
    </div>
  )
}

export default React.memo(AddNewTask)
