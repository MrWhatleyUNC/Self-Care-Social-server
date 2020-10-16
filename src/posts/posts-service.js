const xss = require('xss')

const PostsService = {
  getAllPosts(db) {
    return db
      .from('selfcare_posts AS pst')
      .select(
        'pst.id',
        'pst.text',
        'pst.date_created',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'username', usr.username,
              'date_created', usr.date_created
            )
          ) AS "author"`
        ),
      )
      .leftJoin(
        'selfcare_comments AS comm',
        'pst.id',
        'comm.post_id'
      )
      .leftJoin(
        'selfcare_users AS usr',
        'pst.user_id',
        'usr.id'
      )
      .groupBy('pst.id', 'usr.id')
  },

  getByUserId(db, user_id){
    return PostsService.getAllPosts(db)
      .where('pst.user_id', user_id)
  },

  getById(db, id) {
    return PostsService.getAllPosts(db)
      .where('pst.id', id)
      .first()
  },

  getCommentsForPost(db, post_id) {
    return db
      .from('selfcare_comments AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.username,
                  usr.date_created
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where('comm.post_id', post_id)
      .leftJoin(
        'selfcare_users AS usr',
        'comm.user_id',
        'usr.id'
      )
      .groupBy('comm.id', 'usr.id')
  },

  insertPost(db, newPost) {
    return db
      .insert(newPost)
      .into('selfcare_posts')
      .returning('*')
      .then(([post]) => post)
      .then(post =>
        PostsService.getById(db, post.id)
      )
  },

  deletePost(db, postId){
    console.log('postId to be deleted:', postId)
    return PostsService.getById(db, postId)
    .delete()
  },

  serializePost(post) {
    const { author } = post
    return {
      id: post.id,
      text: xss(post.text),
      date_created: new Date(post.date_created),
      user_id: xss(post.user_id),
      author: {
        id: author.id,
        username: author.username,
        date_created: new Date(author.date_created)
      },
    }
  },

  serializePostComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      post_id: comment.post_id,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        username: user.username,
        date_created: new Date(user.date_created)
      },
    }
  },
}

module.exports = PostsService