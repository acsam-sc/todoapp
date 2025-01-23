import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Task from './task'
import AddNewTask from './addnewtask'
import TimeFilters from './timefilters'
import Error from './error'

const ToDoApp = () => {
  const [tasksArray, setTasksArray] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [error, setError] = useState({ type: null, text: null })
  const category = useParams().category.toLowerCase()
  const [isFetching, setIsFetching] = useState(null)

  const sendNewTask = async (title) => {
    if (title !== '') {
      try {
        const response = await axios.post(`/api/v1/tasks/${category}`, { title })
        if (response.data.status === 'success') {
          setTasksArray([
            ...tasksArray,
            {
              taskId: response.data.taskId,
              title,
              status: 'new'
            }
          ])
          setNewTaskTitle(response.data.taskId)
        }
      } catch {
        setError({ type: 'sending', text: 'Error sending task, please try again' })
      }
    }
  }

  const getData = useCallback(
    async (path) => {
      setIsFetching(true)
      try {
        const { data } = await axios.get(`/api/v1/tasks/${category}${path}`)
        setIsFetching(false)
        setTasksArray(data)
      } catch {
        setIsFetching(false)
        setError({ type: 'connection', text: 'Cannot connect to the server, please reload page' })
      }
    },
    [category]
  )

  useEffect(() => {
    getData('')
  }, [getData])

  return (
    <div className="flex flex-row w-full absolute inset-0 justify-center bg-gray-100">
      <div className="flex flex-col md:w-1/2 w-full justify-between bg-yellow-200">
        <div className="flex flex-row justify-between bg-orange-300">
          <div className="flex p-4 font-bold md:text-2xl text-normal">Tasks for {category}:</div>
          <div className="flex pr-2 items-center">
            <Link className="px-1 bg-gray-400 rounded md:text-xl text-sm" to="/">
              Back
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-around bg-orange-300">
          <TimeFilters getData={getData} />
        </div>
        <div className="flex flex-grow flex-col overflow-y-auto">
          {tasksArray.length > 0 &&
            tasksArray.map((it) => (
              <Task
                key={it.taskId}
                taskId={it.taskId}
                title={it.title}
                status={it.status}
                category={category}
              />
            ))}
          {error.type === 'connection' && <Error error={error.text} />}
          {isFetching && (
            <div className="flex flex-grow p-2 w-full font-semibold md:text-xl text-sm items-center justify-center">
              Loading...
            </div>
          )}
          {tasksArray.length === 0 && !error && !isFetching && (
            <div className="flex flex-grow p-2 w-full font-semibold md:text-xl text-sm items-center justify-center">
              List is empty
            </div>
          )}
        </div>
        <div className="flex">
          <AddNewTask sendNewTask={sendNewTask} newTaskTitle={newTaskTitle} />
        </div>
      </div>
    </div>
  )
}

export default ToDoApp
