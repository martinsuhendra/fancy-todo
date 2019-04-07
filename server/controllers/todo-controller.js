const Todo = require('../models/todo-model')

class TodoController {
    static showTodo(req,res) {
        console.log(req.params.id)
        Todo
         .find({
             userId : req.params.id
         })
         .then((lists)=> {
            res.status(200).json(lists)
         })
         .catch((err)=> {
             res.status(500).json(err.message)
         })
    }

    static addTodo(req,res) {
        let {title, description, status, dueDate, dueTime,createdAt,completedAt, userId} = req.body
        Todo
            .create({
                title, description, status, dueDate, dueTime,createdAt,completedAt, userId
            })
            .then(()=> {
                res.status(201).json({msg: `todo successfuly added`, todoDetails: req.body})
            })
            .catch((err)=> {
                res.status(500).json(err.message)
            })
    }

    static changeStatus(req,res) {
        Todo
            .findById(req.params.id) 
            .then((list)=> {
                let checkStatus = null
                let completed = null

                if (list.status == false) {
                    checkStatus = true
                    completed = new Date
                } else {
                    checkStatus = false
                }
                return list.update({
                    status : checkStatus,
                    completedAt : completed
                })
            })
            .then(()=> {
                res.status(200).json({msg: `successfully update data`})
            })
            .catch((err)=> {
                res.status(500).json(err.message)
            })  
    }

    static deleteTodo(req,res) {
        Todo
            .findByIdAndRemove(req.params.id)
            .then(()=> {
                res.status(200).json({msg: `successfully delete from your lists`})
            })
            .catch((err)=> {
                res.status(500).json(err.message)
            })
    }
}

module.exports = TodoController