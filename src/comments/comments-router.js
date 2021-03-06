const express = require('express')
const path = require('path')
const CommentsService = require('./comments-service')
const { requireAuth } = require('../middleware/jwt-auth')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()

commentsRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { post_id, text } = req.body
    const newComment = { post_id, text }
    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    
    newComment.user_id = req.user.id

    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(CommentsService.serializeComment(comment))
      })
      .catch(next)
  })

commentsRouter
  .route('/delete')
  .all(requireAuth)
  .delete(jsonBodyParser, (req, res, next) => {
    CommentsService.deleteComment(
      req.app.get('db'),
      req.body.comment_id
    )
    .then(res.status(201))
    .catch(next)
  })

module.exports = commentsRouter
