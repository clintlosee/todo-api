var express     = require('express'),
    bodyParser  = require('body-parser'),
    _           = require('underscore'),
    db          = require('./db.js');

var app         = express(),
    port        = process.env.PORT || 8000,
    todos       = [{
        id: 1,
        description: 'Meet wife for lunch',
        completed: false
    }, {
        id: 2,
        description: 'Go to the store',
        completed: false
    }, {
        id: 3,
        description: 'Eat lunch',
        completed: true
    }],
    todosArr = [],
    todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var filteredTodos = todosArr;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match = _.findWhere(todosArr, {id: todoId});
    // var match;

    // SLOWER
    // todos.forEach(function(todo) {
    //     if (todo.id === todoId) {
    //         match = todo;
    //     }
    // });

    // FASTER
    // for (var i = 0; i < todosArr.length; i++) {
    //     if (todosArr[i].id === todoId) {
    //         match = todosArr[i];
    //     }
    // }

    if (match) {
        res.json(match);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.send(400).json(e);
    });

    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //     return res.status(400).send();
    // }

    // body.description = body.description.trim();
    // body.id = todoNextId++;
    // todosArr.push(body);

    // res.json(body);
});

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match = _.findWhere(todosArr, {id: todoId});

    if (!match) {
        return res.status(404).json({"error": "No todo found with that id"});
    } else {
        todosArr = _.without(todosArr, match);
        res.json(match);
    }
});

app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match = _.findWhere(todosArr, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validatedTodos = {};

    if (!match) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validatedTodos.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description)) {
        validatedTodos.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(match, validatedTodos);
    res.json(match);
});

db.sequelize.sync().then(function() {
    app.listen(port, function() {
        console.log('Magic happens on port ' + port);
    });
});