const todoController = require('../controllers/todo-controller')
const router = require('express').Router()


router.get('/:id', todoController.showTodo)
router.put('/:id/update',todoController.changeStatus)
router.delete('/:id/delete',todoController.deleteTodo)
router.post('/create', todoController.addTodo)

module.exports = router
