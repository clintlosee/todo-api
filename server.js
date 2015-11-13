var express = require('express'),
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
        description: 'Eat dinner',
        completed: true
    }];

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
    res.json(todos);
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10),
        match;

    todos.forEach(function(todo) {
        if (todo.id === todoId) {
            match = todo;
        }
    });

    if (match) {
        res.json(match);
    } else {
        res.status(404).send();
    }
});

app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});
