import React, { useState } from 'react'

const Task = (props) => {
  const [editMode, setEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)

  return (
    <div className="border-2 m-2 pl-4 w-1/2 text-xl">
      <div className="border-2 flex flex-row justify-between items-center">
        {editMode
          ? <div className="flex"><b>Title:</b>
              <input
                className="border-2"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          : <div className="flex"><b>Title:</b> {props.title}</div>
        }
        
        {editMode
          ? <button
            type="button"
            className="flex m-1 mr-2 bg-gray-400"
            onClick={() => setEditMode(false)}
            // onKeyDown={() => setEditMode(false)}
          >Save</button>
          : <button
            type="button"
            className="flex m-1 mr-2 bg-gray-400"
            onClick={() => setEditMode(true)}
            // onKeyDown={() => setEditMode(true)}
          >Edit</button>
      }
      </div>
      <div className="border-2 flex flex-row">
        <div className="flex"><b>Status:</b> {props.status}</div>
      </div>
    </div>
  )
}

 export default Task
