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
	var query = req.query;
	var where = {};
	
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if ( query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}
	
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}
	
	db.todo.findAll({where: where}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
        if(!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).json(e);
    });
});

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.send(400).json(e);
    });
});

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No todo with that id'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });
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