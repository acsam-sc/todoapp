import React from 'react'

const StatusFilters = ({ getData, setStatusToFilter }) => {
  const buttonStyle = 'flex m-1 mr-2 px-1 rounded md:text-normal text-sm'

  const handleOnClick = (status) => {
    setStatusToFilter(status)
    getData('')
  }

  return (
    <>
      <button
        type="button"
        className={`${buttonStyle} bg-gray-300`}
        onClick={() => handleOnClick('')}
      >
        All
      </button>
      <button
        type="button"
        className={`${buttonStyle} bg-gray-300`}
        onClick={() => handleOnClick('new')}
      >
        New
      </button>
      <button
        type="button"
        className={`${buttonStyle} bg-blue-500`}
        onClick={() => handleOnClick('in_progress')}
      >
        In progress
      </button>
      <button
        type="button"
        className={`${buttonStyle} bg-green-500`}
        onClick={() => handleOnClick('done')}
      >
        Done
      </button>
      <button
        type="button"
        className={`${buttonStyle} bg-red-500`}
        onClick={() => handleOnClick('blocked')}
      >
        Blocked
      </button>
    </>
  )
}

export default StatusFilters
