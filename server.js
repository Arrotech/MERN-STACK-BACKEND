const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', {
    useNewUrlParser: true
});

const connection = mongoose.connection;

connection.once('open', function () {
    console.log('MongoDB database connection established successfully!')
})

// Add a new todo item
todoRoutes.route('/add').post(function (req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(
            todo => {
                res.status(201).json({
                    'status': '200',
                    'message': 'Todo added successfully'
                });
            }
        ).catch(err => {
            res.status(400).json({
                'status': "400",
                'message': "Failed to add new todo"
            })
        });

});

// Fetch all todos items
todoRoutes.route('/').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                "status": "200",
                "message": "success",
                "todos": todos
            });
        }

    })

})

// Find todo by id
todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        if (err) {
            console.log(err)
        } else {
            res.json({
                "status": "200",
                "message": "success",
                "todo": todo
            });
        }
    })

})

// Update an existing todo
todoRoutes.route('/update/:id').post(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        if (!todo) {
            res.status(404).send('Todo not found');
        } else {
            todo.title = req.body.title;
            todo.description = req.body.description;
            todo.responsible = req.body.responsible;
            todo.priority = req.body.priority;
            todo.completed = req.body.completed;

            todo.save()
                .then(todo => {
                    res.json({
                        'status': '200',
                        'message': "Todo updated successfully"
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        'status': "400",
                        'message': "Failed to add new todo"
                    })
                })
        }
    })
})

app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log('Server is running on port: ' + PORT)
})