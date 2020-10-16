const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('selfcare_comments AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        'comm.post_id',
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
      .leftJoin(
        'selfcare_users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .where('comm.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('selfcare_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  deleteComment(db, commentId){
    return CommentsService.getById(db, commentId)
    .del()
  },

  serializeComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        username: user.username,
        date_created: new Date(user.date_created)
      },
      post_id: comment.post_id,
    }
  }
}

module.exports = CommentsService