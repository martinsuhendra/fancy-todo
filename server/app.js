require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const loginRoutes = require('./routes/login-routes');
const todoRoutes = require('./routes/todo-routes')
const authentication = require('./middleware/authentication')

const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fancyToDo', {useNewUrlParser: true});

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/', loginRoutes)
app.use('/todo', authentication, todoRoutes)

app.listen(port, ()=> {
    console.log(`listening on port : ${port}`);
})