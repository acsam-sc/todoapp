import React from 'react'
import Category from './category'

const CategoriesList = (props) => {
  const { categoriesArray } = props

  return categoriesArray.map((category) => {
    return <Category key={category} category={category} {...props} />
  })
}

export default CategoriesList
