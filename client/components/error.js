import React from 'react'

const Error = ({ error }) => {
  return (
    <span className="flex font-semibold md:text-xl text-sm text-red-700 items-center justify-center">
      {error}
    </span>
  )
}

export default Error
