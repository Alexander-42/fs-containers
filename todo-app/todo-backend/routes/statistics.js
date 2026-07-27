const express = require('express')
const { get } = require('../redis')
const router = express.Router()

router.get('/', async (_, res) => {
  let createdTodosCount = await get('added_todos')
  if (!createdTodosCount) {
    createdTodosCount = 0
  }
  res.send({"added_todos": Number(createdTodosCount)})
})

module.exports = router