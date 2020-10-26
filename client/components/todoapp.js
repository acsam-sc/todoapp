import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Task from './task'
import AddNewTask from './addnewtask'

const ToDoApp = () => {
  const [tasksArray, setTasksArray] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  // const [error, setError] = useState(null)
  const { category } = useParams()

  const sendNewTask = async (title) => {
    try {
      const response = await axios.post(`http://localhost:8090/api/v1/tasks/${category}`, { title })
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
        const { data } = await axios.get(`http://localhost:8090/api/v1/tasks/${category}`)
        setTasksArray(data)
      } catch {
        console.error('Cannot connect to server')
      }
    }
    getData()
  }, [category])

  // const tasksList = []
  // if (tasksArray.length !== 0) tasksList = tasksArray.map(it => <Task key={it.taskId} title={it.title} status={it.status} />)
  //   else if (error) return <span className="m-2 pl-4 w-1/2 font-semibold text-xl text-red-600">{error}</span>
  //   else return <span className="m-2 pl-4 w-1/2 font-semibold text-xl">List is empty</span>

  return (
    <div className="p-4 w-1/2 bg-gray-100">
      <span className="font-bold text-2xl">Task list for category {`"${category}"`}:</span>
      <div>
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
          <span className="p-2 pl-4 w-full font-semibold text-xl">List is empty</span>
        )}
      </div>
      <div className="p-2 pl-4">
        <AddNewTask sendNewTask={sendNewTask} newTaskTitle={newTaskTitle} />
      </div>
    </div>
  )
}

export default ToDoApp
