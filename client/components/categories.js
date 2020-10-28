import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { history } from '../redux'

const Categories = () => {
  const apiUrl = `${window.location.origin}/api/v1`
  const [categoriesArray, setCategoriesArray] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/categories`)
        setCategoriesArray(data.categories)
      } catch {
        console.error('Cannot connect to server')
      }
    }
    getData()
  }, [apiUrl])

  const CategoriesList = () => {
      return categoriesArray.map((it) => {
        return (
          <div className="p-2 pl-4 border-2 text-xl font-semibold bg-yellow-300" key={it}>
            <Link to={`/${it}`}>{it}</Link>
          </div>
        )
      })
  }

  return (
    <div className="flex flex-row w-full justify-center min-h-screen">
      <div className="flex flex-col lg:w-1/2 w-full justify-between">
        <div className="p-4 text-2xl font-bold bg-orange-300">Categories List:</div>
        <div className="flex flex-grow flex-col w-full bg-yellow-200">
          {(categoriesArray.length > 0)
          ? <CategoriesList />
          : (<div className="flex flex-grow p-2 pl-4 text-xl font-semibold items-center justify-center">
              There are no categories yet
          </div>)
          }
        </div>
        <div className="flex flex-row border-2 w-full text-xl justify-between items-center bg-blue-200">
          <span className="flex font-semibold px-2">New category:</span>
          <input
            className="flex flex-grow border-2 border-black"
            placeholder="Enter category name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="flex m-1 mr-2 px-1 bg-gray-500"
            type="button"
            onClick={() => history.push(`/${inputValue.toLowerCase()}`)}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Categories)
