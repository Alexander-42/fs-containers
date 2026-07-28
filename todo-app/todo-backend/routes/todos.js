const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

const { set, get } = require('../redis')

const updateTodoCounter = async () => {
  let currAddedTodos = await get('added_todos');
  if (!currAddedTodos) {
    currAddedTodos = 0
  }

  await set('added_todos', Number(currAddedTodos)+1)
}


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  updateTodoCounter()
  
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.deleteOne()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const thisTodo = req.todo
  res.send(thisTodo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.todo._id,
    {
      text: text ?? req.todo.text,
      done: done ?? req.todo.done,
    },
    { new: true, runValidators: true }
  );
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
