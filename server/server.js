import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import shortid from 'shortid'
import { promises } from 'fs'
import sockjs from 'sockjs'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile, readdir, mkdir, access, unlink, rename } = promises

const categoriesDir = `${__dirname}/tasks`
const file = (filename) => `${categoriesDir}/${filename}.json`

const Root = () => ''

try {
  // eslint-disable-next-line no-console
  console.log(Root)
} catch (ex) {
  // eslint-disable-next-line no-console
  console.log('run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true })
]

middleware.forEach((it) => server.use(it))

const writeCategoryFile = async (data, filename) => {
  await access(categoriesDir).catch((err) => {
    if (err.code === 'ENOENT') {
      mkdir(categoriesDir)
    }
  })
  writeFile(file(filename), JSON.stringify(data), { encoding: 'utf8' })
}

// rename file, so it will be filtered in readCategoriesDir
const deleteCategoryFile = async (category) => {
  const timestamp = new Date()
  const year = timestamp.getUTCFullYear().toString().padStart(2, '0')
  const month = timestamp.getUTCMonth().toString().padStart(2, '0')
  const date = timestamp.getUTCDate().toString().padStart(2, '0')
  const hours = timestamp.getUTCHours().toString().padStart(2, '0')
  const minutes = timestamp.getUTCMinutes().toString().padStart(2, '0')

  try {
    await access(file(category))
    await rename(
      file(category),
      `${categoriesDir}/${year}${month}${date}-${hours}${minutes}-${category}.del`
    )
  } catch (error) {
    return error
  }
  return true
}

const deleteAllFiles = async () => {
  const dirFiles = await readdir(categoriesDir)
  dirFiles.forEach((it) => unlink(`${categoriesDir}/${it}`))
}

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

const readCategoriesDir = async () => {
  const dirFiles = await readdir(categoriesDir).catch((err) => {
    if (err.code === 'ENOENT') {
      return []
    }
    return err
  })
  return dirFiles.filter((filename) => filename.endsWith('.json'))
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  const deleted = '_isDeleted'
  const data = await readCategoryFile(req.params.category)
  const response = data
    .filter((it) => !it[deleted])
    .map((it) => {
      const filteredKeys = Object.keys(it).filter((key) => key[0] !== '_')
      return filteredKeys.reduce((acc, item) => {
        return { ...acc, [item]: it[item] }
      }, {})
    })
  res.json(response)
})

server.get('/api/v1/categories', async (req, res) => {
  const dirFiles = await readCategoriesDir()
  const categoriesArray = dirFiles.map((it) => {
    return it
      .split('')
      .slice(0, it.length - 5)
      .join('')
  })
  const response = { status: 'success', categories: categoriesArray }
  res.json(response)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const deleted = '_isDeleted'
  const created = '_createdAt'
  const day = 86400000
  const data = await readCategoryFile(req.params.category)
  const response = data
    .filter((it) => !it[deleted])
    .filter((it) => {
      switch (req.params.timespan) {
        case 'day':
          return it[created] + day > +new Date()
        case 'week':
          return it[created] + day * 7 > +new Date()
        case 'month':
          return it[created] + day * 30 > +new Date()
        default:
          return false
      }
    })
    .map((it) => {
      const filteredKeys = Object.keys(it).filter((key) => key[0] !== '_')
      return filteredKeys.reduce((acc, item) => {
        return { ...acc, [item]: it[item] }
      }, {})
    })
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

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const data = await readCategoryFile(req.params.category)
  const dataToWrite = data.map((it) => {
    if (it.taskId === req.params.id) return { ...it, ...req.body }
    return it
  })
  writeCategoryFile(dataToWrite, req.params.category)
  const responseBody = { status: 'success', taskId: req.params.id }
  res.json(responseBody)
})

server.delete('/api/v1/deleteall', async (req, res) => {
  deleteAllFiles()
  const responseBody = { status: 'success' }
  res.json(responseBody)
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const data = await readCategoryFile(req.params.category)
  const dataToWrite = data.map((it) => {
    if (it.taskId === req.params.id) return { ...it, _isDeleted: true, _deletedAt: +new Date() }
    return it
  })
  writeCategoryFile(dataToWrite, req.params.category)
  const responseBody = { status: 'success', taskId: req.params.id }
  res.json(responseBody)
})

server.delete('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params.category
  try {
    await deleteCategoryFile(req.params.category)
    const responseBody = { status: 'success', category }
    res.json(responseBody)
  } catch (error) {
    const responseBody = { status: 'error', category }
    res.json(responseBody)
  }
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Simple ToDo App'
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
