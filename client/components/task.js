import React, { useState } from 'react'
import axios from 'axios'

const Task = (props) => {
  const [editMode, setEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const [title, setTitle] = useState(props.title)

  const patchTitle = async (taskId, newTitle) => {
    if (inputValue !== title) {
      try {
        const response = await axios.patch(`http://localhost:8090/api/v1/tasks/${props.category}`, {
          title: newTitle,
          taskId
        })
        if (response.data.status === 'success' && response.data.taskId === taskId)
          setTitle(newTitle)
      } catch {
        console.error('Error patching Title')
      }
    }
    setEditMode(false)
  }

  return (
    <div className="p-2 pl-4 w-full text-xl">
      <div className="border-2 flex flex-row justify-between items-center bg-yellow-200">
        <div className="flex">
          <b className="flex px-2">Title:</b>
          {editMode ? (
            <input
              className="flex border-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          ) : (
            <span>{title}</span>
          )}
        </div>

        <button
          type="button"
          className="flex m-1 mr-2 px-1 bg-gray-400"
          onClick={() => (editMode ? patchTitle(props.taskId, inputValue) : setEditMode(true))}
        >
          {editMode ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="border-2 flex flex-row bg-green-200">
        <div className="flex">
          <b className="px-2">Status:</b>
          {props.status}
        </div>
      </div>
    </div>
  )
}

export default Task
