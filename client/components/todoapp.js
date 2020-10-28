import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Task from './task'
import AddNewTask from './addnewtask'

const ToDoApp = () => {
  const apiUrl = `${window.location.origin}/api/v1`
  const [tasksArray, setTasksArray] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  // const [error, setError] = useState(null)
  const { category } = useParams()

  const sendNewTask = async (title) => {
    try {
      const response = await axios.post(`${apiUrl}/tasks/${category}`, { title })
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
      console.error('Error sending Task')
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/tasks/${category}`)
        setTasksArray(data)
      } catch {
        console.error('Cannot connect to server')
      }
    }
    getData()
  }, [category, apiUrl])

  // const tasksList = []
  // if (tasksArray.length !== 0) tasksList = tasksArray.map(it => <Task key={it.taskId} title={it.title} status={it.status} />)
  //   else if (error) return <span className="m-2 pl-4 w-1/2 font-semibold text-xl text-red-600">{error}</span>
  //   else return <span className="m-2 pl-4 w-1/2 font-semibold text-xl">List is empty</span>

  return (
    <div className="flex flex-row w-full min-h-screen justify-center bg-gray-100">
      <div className="flex flex-col w-1/2 justify-between bg-yellow-200">
        <div className="flex flex-row justify-between bg-orange-300">
          <div className="flex p-4 font-bold text-2xl">
            Task list for category {`"${category}"`}:
          </div>
          <div className="flex items-center">
            <Link className="p-2 bg-gray-500" to="/">
              Back
            </Link>
          </div>
        </div>
        <div className="flex flex-grow flex-col">
          {tasksArray.length ? (
            tasksArray.map((it) => (
              <Task
                key={it.taskId}
                taskId={it.taskId}
                title={it.title}
                status={it.status}
                category={category}
              />
            ))
          ) : (
            <span className="flex p-2 w-full font-semibold text-xl">List is empty</span>
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
