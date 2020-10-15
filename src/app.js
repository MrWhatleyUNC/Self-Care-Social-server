require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const postsRouter= require('./posts/posts-router')
const commentsRouter= require('./comments/comments-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = ((NODE_ENV === 'production')
  ? 'tiny'
  : 'common',
  {skip: ()=> NODE_ENV === 'test'})

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
        let response
        if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
        } else {
        console.error(error)
        response = { message: error.message, error }
        }
        res.status(500).json(response)
    })
module.exports = app