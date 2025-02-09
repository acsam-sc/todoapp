import React, { useState } from 'react'
import axios from 'axios'
import useOutsideClick from './useOutsideClick'

const ThreeDotsMenu = (props) => {
  const { status, setStatus, origStatus, setError, editMode, setEditMode } = props
  const [isOpen, setIsOpen] = useState(false)
  const { taskId, category } = props

  const buttonStyle = 'flex px-4 py-2 md:text-base text-xs font-semibold text-gray-700'

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const threeDotsMenuRef = useOutsideClick(() => setIsOpen(false))

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
      setIsOpen(false)
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

  // const handleSaveButton = () => {
  //   patchTitle()
  //   setIsOpen(false)
  // }

  const handleEditButton = () => {
    setEditMode(true)
    setIsOpen(false)
  }

  const InProgressButton = () => {
    return (
      <button
        type="button"
        className={`${buttonStyle} text-blue-400 hover:text-blue-500`}
        onClick={() => {
          setEditMode(false)
          setIsOpen(false)
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
        className={`${buttonStyle} text-red-400 hover:text-red-500`}
        onClick={() => {
          setEditMode(false)
          setIsOpen(false)
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
        className={`${buttonStyle} text-green-400 hover:text-green-500`}
        onClick={() => {
          setEditMode(false)
          setIsOpen(false)
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
        className={`${buttonStyle} hover:bg-gray-100 hover:text-gray-900`}
        onClick={() => handleEditButton()}
      >
        Edit
      </button>
    )
  }

  const DeleteButton = () => {
    return (
      <button
        type="button"
        className={`${buttonStyle} hover:bg-gray-100 hover:text-gray-900`}
        onClick={() => {
          setEditMode(false)
          setIsOpen(false)
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
        className={`${buttonStyle} hover:bg-gray-100 hover:text-gray-900`}
        onClick={() => patchStatus(origStatus)}
      >
        Restore
      </button>
    )
  }

  // const CancelButton = () => {
  //   return (
  //     <button
  //       type="button"
  //       className={`${buttonStyle} hover:bg-gray-100 hover:text-gray-900`}
  //       onClick={() => {
  //         setTitle(origTitle)
  //         setEditMode(false)
  //         setIsOpen(false)
  //       }}
  //     >
  //       Cancel
  //     </button>
  //   )
  // }

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

  return (
    <div ref={threeDotsMenuRef} className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center w-full px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="md:h-5 md:w-5 h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="flex flex-col origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {!editMode && <StatusButtons />}
          {status !== 'deleted' ? (
            <>
              {status !== 'done' && <EditButton />}
              <DeleteButton />
            </>
          ) : (
            <RestoreButton />
          )}
        </div>
      )}
    </div>
  )
}

export default ThreeDotsMenu
