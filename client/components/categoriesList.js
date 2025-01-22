import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const CategoriesList = (props) => {
  const deleteCategory = async (category) => {
    try {
      await axios.delete(`/api/v1/tasks/${category}`)
      props.setCategoriesArray([])
    } catch (error) {
      props.setError({
        type: 'sending',
        text: 'Cannot delete category, try again later'
      })
    }
  }

  return props.categoriesArray.map((category) => {
    return (
      <div
        className="flex flex-row p-2 pl-4 border-2 md:text-xl text-sm font-semibold bg-yellow-300 justify-between"
        key={category}
      >
        <Link to={`/${category}`}>{category}</Link>
        <button
          className="flex m-1 mr-2 px-1 bg-gray-500 rounded items-center"
          type="button"
          onClick={() => deleteCategory(category)}
        >
          Delete
        </button>
      </div>
    )
  })
}

export default CategoriesList
