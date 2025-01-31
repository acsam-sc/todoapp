import React, { useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import Error from './error'
import ThreeDotsMenu from './threedotsmenu'

const Task = (props) => {
  const { taskId, category } = props
  const [editMode, setEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const [title, setTitle] = useState(props.title)
  const [status, setStatus] = useState(props.status)
  const [error, setError] = useState(null)

  const patchTitle = async () => {
    if (inputValue !== title) {
      setError(null)
      try {
        const response = await axios.patch(`/api/v1/tasks/${category}/${taskId}`, {
          title: inputValue
        })
        if (response.data.status === 'success' && response.data.taskId === taskId)
          setTitle(inputValue)
      } catch {
        setError('Error updating title, please try again')
        setTitle(props.title)
      }
    }
    setEditMode(false)
  }

  const handleOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      patchTitle()
    }
  }

  return (
    <div className="flex flex-col p-2 md:px-4 m-1 border-2 rounded-md max-w-full md:text-xl text-sm font-semibold bg-white">
      <div
        className={classnames('flex flex-row justify-between items-center', {
          'text-black': status === 'new',
          'text-red-500': status === 'blocked',
          'text-red-500 line-through': status === 'deleted',
          'text-blue-500': status === 'in_progress',
          'text-green-500': status === 'done'
        })}
      >
        {editMode ? (
          <input
            className="flex flex-1 min-w-0 rounded border-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => handleOnKeyPress(e)}
          />
        ) : (
          <span
            className={classnames(
              status === 'deleted' ? 'flex-1 pl-4 line-through' : 'flex-1 pl-4'
            )}
          >
            {title}
          </span>
        )}

        <ThreeDotsMenu
          origTitle={props.title}
          setTitle={setTitle}
          status={status}
          setStatus={setStatus}
          origStatus={props.status}
          setError={setError}
          editMode={editMode}
          setEditMode={setEditMode}
          taskId={taskId}
          category={category}
          patchTitle={patchTitle}
        />
      </div>

      {error && <Error error={error} />}
    </div>
  )
}

export default Task
