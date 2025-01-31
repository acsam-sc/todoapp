import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Error from './error'
import CategoriesList from './categoriesList'
import NewCategory from './newcategory'

const Categories = () => {
  const [categoriesArray, setCategoriesArray] = useState([])
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isAddingNewCategory, setAddingNewCategory] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setIsFetching(true)
      try {
        const { data } = await axios.get('/api/v1/categories')
        setIsFetching(false)
        setCategoriesArray(data.categories)
      } catch {
        setIsFetching(false)
        setError('Cannot connect to server, please reload page')
      }
    }
    getData()
  }, [])

  return (
    <div className="flex flex-row flex-1 w-full justify-center absolute inset-0">
      <div className="flex flex-col md:w-1/2 w-full justify-between border-2 bg-gray-100">
        <div className="flex p-4 justify-between">
          <span className="flex ml-6 md:text-2xl font-bold justify-center">Categories</span>
          <button
            className="flex ml-2 px-1 rounded md:text-normal text-xs text-blue-500 bg-blue-200 items-center"
            type="button"
            onClick={() => setAddingNewCategory(!isAddingNewCategory)}
          >
            + New Category
          </button>
        </div>
        <div className="flex flex-grow flex-col w-full overflow-y-auto">
          {isAddingNewCategory && <NewCategory setAddingNewCategory={setAddingNewCategory} />}
          {categoriesArray.length > 0 && (
            <CategoriesList
              categoriesArray={categoriesArray}
              setCategoriesArray={setCategoriesArray}
              setError={setError}
            />
          )}
          {error && <Error error={error} />}
          {isFetching && (
            <div className="flex flex-grow p-2 pl-4 md:text-xl font-semibold items-center justify-center">
              Loading...
            </div>
          )}
          {categoriesArray.length === 0 && !error && !isFetching && (
            <div className="flex flex-grow p-2 pl-4 md:text-xl font-semibold items-center justify-center">
              There are no categories yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Categories)
