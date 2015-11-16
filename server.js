var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
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
    var todoId = parseInt(req.params.id, 10),
        match;

    // SLOWER
    // todos.forEach(function(todo) {
    //     if (todo.id === todoId) {
    //         match = todo;
    //     }
    // });

    for (var i = 0; i < todosArr.length; i++) {
        if (todosArr[i].id === todoId) {
            match = todosArr[i];
        }
    }

    if (match) {
        res.json(match);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res) {
    var body = req.body;

    body.id = todoNextId++;
    todosArr.push(body);

    res.json(body);
});

app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});
