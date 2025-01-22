import React from 'react'

const TimeFilters = ({ getData }) => {
  return (
    <>
      <button type="button" className="flex m-1 mr-2 px-1 rounded bg-gray-300" onClick={() => getData('')}>
        All
      </button>
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-300"
        onClick={() => getData('/day')}
      >
        Day
      </button>
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-300"
        onClick={() => getData('/week')}
      >
        Week
      </button>
      <button
        type="button"
        className="flex m-1 mr-2 px-1 rounded bg-gray-300"
        onClick={() => getData('/month')}
      >
        Month
      </button>
    </>
  )
}

export default TimeFilters
