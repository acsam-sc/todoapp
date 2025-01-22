import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'
import { history } from '../redux'
import Error from './error'
import CategoriesList from './categoriesList'

const Categories = () => {
  const [categoriesArray, setCategoriesArray] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(null)
  const [isFetching, setIsFetching] = useState(null)

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

  const handleOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      history.push(`/${inputValue.toLowerCase()}`)
    }
  }

  return (
    <div className="flex flex-row w-full justify-center min-h-screen">
      <div className="flex flex-col md:w-1/2 w-full justify-between">
        <div className="p-4 md:text-2xl text-normal font-bold bg-orange-300">Categories List:</div>
        <div className="flex flex-grow flex-col w-full bg-yellow-200">
          {categoriesArray.length > 0 &&
            <CategoriesList
              categoriesArray={categoriesArray}
              setCategoriesArray={setCategoriesArray}
              setError={setError}
            />}
          {error && <Error error={error} />}
          {isFetching && (
            <div className="flex flex-grow p-2 pl-4 md:text-xl text-sm font-semibold items-center justify-center">
              Loading...
            </div>
          )}
          {categoriesArray.length === 0 && !error && !isFetching && (
            <div className="flex flex-grow p-2 pl-4 md:text-xl text-sm font-semibold items-center justify-center">
              There are no categories yet
            </div>
          )}
        </div>
        <div className="flex flex-row border-2 w-full md:text-xl text-sm justify-between items-center bg-blue-200">
          <span className="flex font-semibold px-2">New category:</span>
          <input
            className="flex flex-grow border-2 rounded border-black"
            placeholder="Enter category name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => handleOnKeyPress(e)}
          />
          <button
            className="flex m-1 mr-2 px-1 rounded bg-gray-500"
            type="button"
            onClick={() => history.push(`/${inputValue.toLowerCase()}`)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Categories)
