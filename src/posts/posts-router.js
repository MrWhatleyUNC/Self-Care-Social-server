const express = require('express')
const path = require('path')
const PostsService = require('./posts-service')
const { requireAuth } = require('../middleware/jwt-auth')

const postsRouter = express.Router()
const jsonBodyParser = express.json()

postsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PostsService.getAllPosts(req.app.get('db'))
      .then(posts => {
        res.json(posts.map(post=> PostsService.serializePost(post)))
      })
      .catch(next)
  })

postsRouter
  .route('/by-user/:userId')
  .all(requireAuth)
  .get((req, res, next)=>{
      PostsService.getByUserId(req.app.get('db'), req.params.userId)
        .then(posts => {
            res.json(posts.map(post=> PostsService.serializePost(post)))
        })
        .catch(next)
  })

postsRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next)=>{
    const {user_id, text}= req.body
    const newPost= {user_id, text}
  
    for (const [key, value] of Object.entries(newPost))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    PostsService.insertPost(
        req.app.get('db'),
        newPost
    )
    .then(post=> {
        res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${post.id}`))
            .json(PostsService.serializePost(post))
    })
    .catch(next)
  })

postsRouter
  .route('/:post_id')
  .all(requireAuth)
  .all(checkPostExists)
  .get((req, res) => {
    res.json(PostsService.serializePost(res.post))
  })

postsRouter
  .route('/:post_id/comments/')
  .all(requireAuth)
  .all(checkPostExists)
  .get((req, res, next) => {
    PostsService.getCommentsForPost(
      req.app.get('db'),
      req.params.post_id
    )
      .then(comments => {
        res.json(comments.map(comment=> PostsService.serializePostComment(comment)))
      })
      .catch(next)
  })

postsRouter
  .route('/delete')
  .all(requireAuth)
  .delete(jsonBodyParser, (req, res, next)=>{
    console.log('req.body of delete post:',req.body)
    PostsService.deletePost(
      req.app.get('db'),
      req.body.post_id
    )
    .then(res.status(201))
    .catch(next)
  })

/* async/await syntax for promises */
async function checkPostExists(req, res, next) {
  try {
    const post = await PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )

    if (!post)
      return res.status(404).json({
        error: `Post doesn't exist`
      })

    res.post = post
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = postsRouter