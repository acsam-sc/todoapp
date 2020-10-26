import React, { useState } from 'react'
import axios from 'axios'

const Task = (props) => {
  const [editMode, setEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const [title, setTitle] = useState(props.title)

  const patchTitle = async (taskId, newTitle) => {
    if (inputValue !== title) {
      try {
        const response = await axios.patch(`http://localhost:8090/api/v1/tasks/${props.category}`, { title: newTitle, taskId })
        console.log('response', response)
        if (response.data.status === 'success' && response.data.taskId === taskId) setTitle(newTitle)
      } catch {
        console.error('Error patching Title')
      }
    }
    setEditMode(false)
  }

  return (
    <div className="border-2 m-2 pl-4 w-1/2 text-xl">
      <div className="border-2 flex flex-row justify-between items-center">
        {editMode ? (
          <div className="flex">
            <b className="pr-2">Title:</b>
            <input
              className="border-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex">
            <b className="pr-2">Title:</b> {title}
          </div>
        )}
        <button
          type="button"
          className="flex m-1 mr-2 bg-gray-400"
          onClick={() => editMode ? patchTitle(props.taskId, inputValue) : setEditMode(true)}
        >
          {editMode ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="border-2 flex flex-row">
        <div className="flex">
          <b className="pr-2">Status:</b>
          {props.status}
        </div>
      </div>
    </div>
  )
}

export default Task
