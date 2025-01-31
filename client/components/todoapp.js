import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Task from './task'
import AddNewTask from './addnewtask'
import StatusFilters from './statusfilters'
import Error from './error'

const ToDoApp = () => {
  const [tasksArray, setTasksArray] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [statusToFilter, setStatusToFilter] = useState('')
  const [error, setError] = useState({ type: null, text: null })
  const { category } = useParams()
  const [isFetching, setIsFetching] = useState(null)
  const [isAddingNewtask, setAddingNewTask] = useState(false)

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
    <div className="flex flex-row w-full absolute inset-0 justify-center">
      <div className="flex flex-col md:w-1/2 w-full border-2 justify-between bg-gray-100">
        <div className="flex flex-row px-4 justify-between">
          <div className="flex p-4 font-bold md:text-2xl text-normal">{category}</div>
          <div className="flex pr-2 items-center">
            <button
              className="flex mr-2 p-2 rounded md:text-normal text-xs text-blue-500 bg-blue-200 items-center"
              type="button"
              onClick={() => setAddingNewTask(!isAddingNewtask)}
            >
              + New Task
            </button>
            <Link className="px-1 bg-gray-300 rounded md:text-normal text-sm" to="/">
              Back
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-around">
          <StatusFilters getData={getData} setStatusToFilter={setStatusToFilter} />
        </div>
        <div className="flex flex-grow flex-col overflow-y-auto">
          {isAddingNewtask && (
            <AddNewTask
              sendNewTask={sendNewTask}
              newTaskTitle={newTaskTitle}
              setAddingNewTask={setAddingNewTask}
            />
          )}
          {tasksArray.length > 0 &&
            tasksArray
              .filter((task) => (statusToFilter ? task.status === statusToFilter : true))
              .map((it) => (
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
      </div>
    </div>
  )
}

export default ToDoApp
