var express = require('express'),
    app     = express(),
    port    = process.env.port || 8000;

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});
