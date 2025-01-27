import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Category = (props) => {
  const [isCategoryChecked, setIsCategoryChecked] = useState(false)
  const { category, categoriesArray, setCategoriesArray, setError } = props

  const deleteCategory = async () => {
    try {
      await axios.delete(`/api/v1/tasks/${category}`)
      setCategoriesArray(categoriesArray.filter((it) => it !== category))
    } catch (error) {
      setError({
        type: 'sending',
        text: 'Cannot delete category, try again later'
      })
    }
  }

  return (
    <div className="flex flex-row p-2 px-2 md:px-4 m-2 border-2 rounded-md md:text-xl text-sm font-semibold justify-between bg-white">
      <input
        className="flex mr-2 rounded justify-center"
        type="checkbox"
        checked={isCategoryChecked}
        onChange={() => setIsCategoryChecked(!isCategoryChecked)}
      />
      <Link className="flex-1 content-center" to={`/${category}`}>
        {category}
      </Link>
      {isCategoryChecked && (
        <button
          className="flex m-1 px-1 md:text-sm bg-gray-300 rounded"
          type="button"
          onClick={() => deleteCategory(category)}
        >
          Delete
        </button>
      )}
    </div>
  )
}

export default Category
