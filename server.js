var express = require('express'),
    bodyParser = require('body-parser'),
    _       = require('underscore'),
    app     = express(),
    port    = process.env.PORT || 8000,
    todos   = [{
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
    res.json(todosArr);
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    // var match;
    var match = _.findWhere(todosArr, {id: todoId});

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

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId++;
    todosArr.push(body);

    res.json(body);
});

app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});
