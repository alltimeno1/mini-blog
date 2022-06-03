const express = require('express')
const Count = require('../schemas/count')
const Comments = require('../schemas/comment')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params
  const comments = await Comments.find({ postId })
    .sort({ commentId: -1 })
    .select('-_id -__v')
    .exec()

  res.json({ comments })
})

router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params
    const { content } = req.body
    const { nickname } = res.locals.user

    if (!content) {
      return res.status(400).send({ message: '댓글 내용을 입력해주세요' })
    }

    const count = await Count.findOneAndUpdate(
      { countId: `post${postId}` },
      { $inc: { counts: 1 } }
    )

    if (!count) {
      await Count.create({ countId: `post${postId}`, counts: 1 })
    }

    const commentId = count?.counts + 1 || 1

    const comment = {
      postId,
      commentId,
      nickname,
      content,
    }

    await Comments.create(comment)

    res.json({ comment })
  } catch {
    res.status(400).json({ message: '댓글 작성 양식이 올바르지 않습니다.' })
  }
})

router.patch('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const { postId, commentId } = req.params
    const { content } = req.body
    const { nickname } = res.locals.user

    if (!content) {
      return res.status(400).json({ message: '수정할 내용을 입력해주세요' })
    }

    const result = await Comments.updateOne({ postId, commentId, nickname }, { content })

    if (!result.acknowledged) {
      return res.status(400).json({ message: '댓글 수정 양식이 올바르지 않습니다.' })
    }

    const comment = await Comments.findOne({ commentId })

    res.json({ comment })
  } catch {}
})

router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  const { postId, commentId } = req.params
  const { nickname } = res.locals.user

  const result = await Comments.deleteOne({ postId, commentId, nickname })

  if (!result.deletedCount) {
    return res.status(400).json({ message: '댓글 삭제 양식이 올바르지 않습니다.' })
  }

  res.json({ message: `${commentId}번 댓글이 삭제되었습니다.` })
})

module.exports = router
