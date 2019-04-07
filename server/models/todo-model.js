const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const TodoSchema = new Schema({
    title : {
        type: String
    },
    description : {
        type: String
    },
    status : {
        type: Boolean
    },
    dueDate : {
        type : Date,
        default : null
    },
    dueTime : {
        type : String,
        default: null
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    completedAt : {
        type : Date,
        default: null
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref: `User`
    }
})

const Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo