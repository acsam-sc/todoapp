import React, { useState } from 'react'
import { history } from '../redux'

const NewCategory = (props) => {
  const [inputValue, setInputValue] = useState('')
  const { setAddingNewCategory } = props

  const handleOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      history.push(`/${inputValue.toLowerCase()}`)
    }
  }

  return (
    <div className="flex flex-row p-2 px-2 md:px-4 m-2 border-2 rounded-md md:text-xl text-sm font-semibold justify-between bg-white">
      <input
        className="flex flex-grow min-w-0 border-2 rounded border-gray-500"
        placeholder="Enter category name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => handleOnKeyPress(e)}
      />
      <button
        className="flex ml-2 px-1 rounded md:text-sm bg-gray-300 items-center"
        type="button"
        onClick={() => {
          setInputValue('')
          history.push(`/${inputValue.toLowerCase()}`)
        }}
      >
        Add
      </button>
      <button
        className="flex ml-2 px-1 rounded md:text-sm bg-gray-300 items-center"
        type="button"
        onClick={() => {
          setInputValue('')
          setAddingNewCategory(false)
        }}
      >
        Cancel
      </button>
    </div>
  )
}

export default NewCategory
