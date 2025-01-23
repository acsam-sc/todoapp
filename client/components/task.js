import React, { useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import Error from './error'

const Task = (props) => {
  const [editMode, setEditMode] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const [title, setTitle] = useState(props.title)
  const [status, setStatus] = useState(props.status)
  const [error, setError] = useState(null)

  const patchTitle = async (newTitle) => {
    if (inputValue !== title) {
      setError(null)
      try {
        const response = await axios.patch(`/api/v1/tasks/${props.category}/${props.taskId}`, {
          title: newTitle
        })
        if (response.data.status === 'success' && response.data.taskId === props.taskId)
          setTitle(newTitle)
      } catch {
        setError('Error updating title, please try again')
      }
    }
    setEditMode(false)
  }

  const patchStatus = async (newStatus, _isDeleted = false, _deletedAt = null) => {
    setError(null)
    try {
      const response = await axios.patch(`/api/v1/tasks/${props.category}/${props.taskId}`, {
        status: newStatus,
        _isDeleted,
        _deletedAt
      })
      if (response.data.status === 'success' && response.data.taskId === props.taskId)
        setStatus(newStatus)
    } catch {
      setError('Error updating status, please try again')
    }
  }

  const deleteTask = async () => {
    setError(null)
    try {
      const response = await axios.delete(`/api/v1/tasks/${props.category}/${props.taskId}`)
      if (response.data.status === 'success' && response.data.taskId === props.taskId)
        setStatus('deleted')
    } catch {
      setError('Error deleting task, please try again')
    }
  }

  const InProgressButton = () => {
    return (
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
        onClick={() => {
          setEditMode(false)
          patchStatus('in progress')
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
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
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
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
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
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
        onClick={() => (editMode ? patchTitle(inputValue) : setEditMode(true))}
      >
        {editMode ? 'Save' : 'Edit'}
      </button>
    )
  }

  const DeleteButton = () => {
    return (
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
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
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
        onClick={() => patchStatus(props.status)}
      >
        Restore
      </button>
    )
  }

  const CancelButton = () => {
    return (
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-400"
        onClick={() => {
          setInputValue(props.title)
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
      case 'in progress':
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
      patchTitle(inputValue)
    }
  }

  return (
    <div className="flex flex-col max-w-full md:text-xl text-sm py-2">
      <div className="border-2 flex flex-row justify-between items-center bg-yellow-300">
        <b className="flex px-2">Title:</b>
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
              status === 'deleted' ? 'flex flex-1 line-through' : 'flex flex-1'
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

      <div
        className={classnames('border-2 flex flex-row justify-between', {
          'bg-gray-500': status === 'new',
          'bg-red-600': status === 'blocked' || status === 'deleted',
          'bg-blue-300': status === 'in progress',
          'bg-green-300': status === 'done'
        })}
      >
        <div className="flex">
          <b className="px-2">Status:</b>
          {status}
        </div>
        <div className="flex flex-row">
          <StatusButtons />
        </div>
      </div>
    </div>
  )
}

export default Task
