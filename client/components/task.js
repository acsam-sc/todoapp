import React, { useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import Error from './error'

const Task = (props) => {
  const { taskId, category } = props
  const [editMode, setEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const [title, setTitle] = useState(props.title)
  const [status, setStatus] = useState(props.status)
  const [error, setError] = useState(null)

  const buttonStyle = 'flex m-1 mr-2 px-1 rounded bg-gray-300 md:text-normal text-sm'

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

  const patchStatus = async (newStatus, _isDeleted = false, _deletedAt = null) => {
    setError(null)
    try {
      const response = await axios.patch(`/api/v1/tasks/${category}/${taskId}`, {
        status: newStatus,
        _isDeleted,
        _deletedAt
      })
      if (response.data.status === 'success' && response.data.taskId === taskId)
        setStatus(newStatus)
    } catch {
      setError('Error updating status, please try again')
    }
  }

  const deleteTask = async () => {
    setError(null)
    try {
      const response = await axios.delete(`/api/v1/tasks/${category}/${taskId}`)
      if (response.data.status === 'success' && response.data.taskId === taskId)
        setStatus('deleted')
    } catch {
      setError('Error deleting task, please try again')
    }
  }

  const InProgressButton = () => {
    return (
      <button
        type="button"
        className={buttonStyle}
        onClick={() => {
          setEditMode(false)
          patchStatus('in_progress')
        }}
      >
        In progress
      </button>
    )
  }

  const BlockButton = () => {
    return (
      <button
        type="button"
        className={buttonStyle}
        onClick={() => {
          setEditMode(false)
          patchStatus('blocked')
        }}
      >
        Block
      </button>
    )
  }

  const DoneButton = () => {
    return (
      <button
        type="button"
        className={buttonStyle}
        onClick={() => {
          setEditMode(false)
          patchStatus('done')
        }}
      >
        Done
      </button>
    )
  }

  const EditButton = () => {
    return (
      <button
        type="button"
        className={buttonStyle}
        onClick={() => (editMode ? patchTitle() : setEditMode(true))}
      >
        {editMode ? 'Save' : 'Edit'}
      </button>
    )
  }

  const DeleteButton = () => {
    return (
      <button
        type="button"
        className={buttonStyle}
        onClick={() => {
          setEditMode(false)
          deleteTask()
        }}
      >
        Del
      </button>
    )
  }

  const RestoreButton = () => {
    return (
      <button type="button" className={buttonStyle} onClick={() => patchStatus(props.status)}>
        Restore
      </button>
    )
  }

  const CancelButton = () => {
    return (
      <button
        type="button"
        className={buttonStyle}
        onClick={() => {
          setTitle(props.title)
          setEditMode(false)
        }}
      >
        Cancel
      </button>
    )
  }

  const StatusButtons = () => {
    switch (status) {
      case 'new':
        return <InProgressButton />
      case 'in_progress':
        return (
          <>
            <BlockButton />
            <DoneButton />
          </>
        )
      case 'blocked':
        return <InProgressButton />
      default:
        return <></>
    }
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
              status === 'deleted' ? 'flex-1 pl-2 line-through' : 'flex-1 pl-4'
            )}
          >
            {title}
          </span>
        )}

        {status !== 'deleted' ? (
          <>
            {status !== 'done' && <EditButton />}
            {editMode ? <CancelButton /> : <DeleteButton />}
          </>
        ) : (
          <RestoreButton />
        )}
      </div>

      {error && <Error error={error} />}

      <div className="flex flex-row justify-between">
        <div className="flex">
          <span className="px-2">({status})</span>
        </div>
        <div className="flex flex-row">
          <StatusButtons />
        </div>
      </div>
    </div>
  )
}

export default Task
