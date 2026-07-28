//AI was used to write this file

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Todo from './Todo'

const unfinishedTodo = {
  _id: '6a67f39443936b55eb84d48e',
  text: 'Learn about containers',
  done: false,
}

const finishedTodo = {
  _id: '6a67f39443936b55eb84d48f',
  text: 'Write code',
  done: true,
}

// Todo calls its props during render — onClickDelete(todo) returns the actual
// click handler — so the mocks have to be curried the same way.
let deleteHandler
let completeHandler
let onClickDelete
let onClickComplete

beforeEach(() => {
  deleteHandler = vi.fn()
  completeHandler = vi.fn()
  onClickDelete = vi.fn(() => deleteHandler)
  onClickComplete = vi.fn(() => completeHandler)
})

const renderTodo = (todo) =>
  render(
    <Todo
      todo={todo}
      onClickDelete={onClickDelete}
      onClickComplete={onClickComplete}
    />
  )

describe('Todo', () => {
  test('renders the todo text', () => {
    renderTodo(unfinishedTodo)

    expect(screen.getByText('Learn about containers')).toBeInTheDocument()
  })

  describe('when the todo is not done', () => {
    test('reports it as not done', () => {
      renderTodo(unfinishedTodo)

      expect(screen.getByText('This todo is not done')).toBeInTheDocument()
      expect(screen.queryByText('This todo is done')).not.toBeInTheDocument()
    })

    test('offers both a delete and a complete button', () => {
      renderTodo(unfinishedTodo)

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Set as done' })).toBeInTheDocument()
    })

    test('completes the todo when "Set as done" is clicked', async () => {
      const user = userEvent.setup()
      renderTodo(unfinishedTodo)

      await user.click(screen.getByRole('button', { name: 'Set as done' }))

      expect(onClickComplete).toHaveBeenCalledWith(unfinishedTodo)
      expect(completeHandler).toHaveBeenCalledTimes(1)
      expect(deleteHandler).not.toHaveBeenCalled()
    })

    test('deletes the todo when "Delete" is clicked', async () => {
      const user = userEvent.setup()
      renderTodo(unfinishedTodo)

      await user.click(screen.getByRole('button', { name: 'Delete' }))

      expect(onClickDelete).toHaveBeenCalledWith(unfinishedTodo)
      expect(deleteHandler).toHaveBeenCalledTimes(1)
      expect(completeHandler).not.toHaveBeenCalled()
    })
  })

  describe('when the todo is done', () => {
    test('reports it as done', () => {
      renderTodo(finishedTodo)

      expect(screen.getByText('This todo is done')).toBeInTheDocument()
      expect(screen.queryByText('This todo is not done')).not.toBeInTheDocument()
    })

    test('does not offer a way to complete it again', () => {
      renderTodo(finishedTodo)

      expect(
        screen.queryByRole('button', { name: 'Set as done' })
      ).not.toBeInTheDocument()
    })

    test('deletes the todo when "Delete" is clicked', async () => {
      const user = userEvent.setup()
      renderTodo(finishedTodo)

      await user.click(screen.getByRole('button', { name: 'Delete' }))

      expect(onClickDelete).toHaveBeenCalledWith(finishedTodo)
      expect(deleteHandler).toHaveBeenCalledTimes(1)
    })
  })

  test('does not fire any handler on render alone', () => {
    renderTodo(unfinishedTodo)

    expect(deleteHandler).not.toHaveBeenCalled()
    expect(completeHandler).not.toHaveBeenCalled()
  })
})
