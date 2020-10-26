import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import shortid from 'shortid'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

// const { readFile, writeFile, unlink } = require('fs').promises
const { readFile, writeFile } = require('fs').promises

const file = (filename) => `${__dirname}/tasks/${filename}.json`

const Root = () => ''

try {
  // eslint-disable-next-line no-console
  console.log(Root)
} catch (ex) {
  // eslint-disable-next-line no-console
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const writeCategoryFile = async (data, filename) => {
  writeFile(file(filename), JSON.stringify(data), { encoding: 'utf8' })
}

// const deleteCategoryFile = async (filename) => unlink(file(filename))

const readCategoryFile = async (filename) => {
  const fd = await readFile(file(filename), { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch((err) => {
      if (err.code === 'ENOENT') {
        return []
      }
      return err
    })
  // console.log('FD', fd)
  return fd
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  const data = await readCategoryFile(req.params.category)
  const response = data.map((it) => {
    const filteredKeys = Object.keys(it).filter((key) => key[0] !== '_')
    return filteredKeys.reduce((acc, item) => {
      return { ...acc, [item]: it[item] }
    }, {})
  })
  // console.log('/api/v1/tasks/:category', data)
  res.json(response)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: +new Date(),
    _deletedAt: null
  }
  await readCategoryFile(req.params.category)
    .then((it) => {
      writeCategoryFile([...it, newTask], req.params.category)
      const responseBody = { status: 'success', taskId: newTask.taskId }
      res.json(responseBody)
    })
    .catch((err) => {
      if (err.code === 'ENOENT') {
        writeCategoryFile([newTask], req.params.category)
        const responseBody = { status: 'success', taskId: newTask.taskId }
        res.json(responseBody)
      }
    })
})

server.patch('/api/v1/tasks/:category', async (req, res) => {
  const data = await readCategoryFile(req.params.category)
  const dataToWrite = data.map((it) => {
    if (it.taskId === req.body.taskId) return { ...it, ...req.body }
    return it
  })
  writeCategoryFile(dataToWrite, req.params.category)
  const responseBody = { status: 'success', taskId: req.body.taskId }
  res.json(responseBody)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
