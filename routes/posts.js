const express = require('express')
const Posts = require('../schemas/post')
const Counts = require('../schemas/count')
const auth = require('../middlewares/auth')
const router = express.Router()
const fields = {
  _id: 0,
  nickname: 1,
  userId: 1,
  title: 1,
  content: 1,
  likes: { $size: '$likes' },
  postedDate: 1,
}

router.get('', async (req, res) => {
  const posts = await Posts.aggregate().project(fields).sort({ postId: -1 })

  res.json({ posts })
})

router.get('/:postId', async (req, res) => {
  const { postId } = req.params
  const post = await Posts.aggregate()
    .match({ postId: Number(postId) })
    .project(fields)

  if (!post.length) {
    return res.status(404).json({ message: `${postId}번 게시글이 존재하지 않습니다.` })
  }

  res.json({ post })
})

router.post('', auth, async (req, res) => {
  try {
    const { title, password, content } = req.body
    const { nickname } = res.locals.user

    const postsCount = await Counts.find({ countId: 'posts' })

    if (!postsCount.length) {
      await Counts.create({ countId: 'posts', counts: 0 })
    }

    await Counts.updateOne({ countId: 'posts' }, { $inc: { counts: 1 } })

    const postId = (await Counts.find({ countId: 'posts' }))[0].counts
    const postedDate = new Date()

    const newPost = {
      postId,
      nickname,
      title,
      password,
      content,
      postedDate,
    }

    await Posts.create(newPost)

    res.json(newPost)
  } catch {
    res.status(400).json({ message: '게시글 작성 양식이 올바르지 않습니다.' })
  }
})

router.patch('/:postId', auth, async (req, res) => {
  const { postId } = req.params
  const { nickname } = res.locals.user
  const { title, password, content } = req.body

  const result = await Posts.updateOne({ postId, nickname, password }, { title, content })

  if (!result.modifiedCount) {
    return res.status(400).json({ message: '게시글 수정 양식이 올바르지 않습니다.' })
  }

  const post = await Posts.findOne({ postId })

  res.json({ post })
})

router.delete('/:postId', auth, async (req, res) => {
  const { postId } = req.params
  const { nickname } = res.locals.user
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ message: '비밀번호를 입력해주세요' })
  }

  const result = await Posts.deleteOne({ postId, nickname, password })

  if (!result.deletedCount) {
    return res.status(400).json({ message: '게시글 수정 양식이 올바르지 않습니다.' })
  }

  res.json({ message: '삭제 완료' })
})

router.patch('/:postId/likes', auth, async (req, res) => {
  const { postId } = req.params
  const { nickname } = res.locals.user

  const post = await Posts.findOne({ postId })

  if (!post) {
    return res.status(404).json({ message: `${postId}번 게시글이 존재하지 않습니다.` })
  }

  if (post.likes.includes(nickname)) {
    post.likes.pull(nickname)
    post.save()

    return res.json({ message: '추천 취소' })
  }

  post.likes.push(nickname)
  post.save()

  return res.json({ message: '추천 완료' })
})

module.exports = router
