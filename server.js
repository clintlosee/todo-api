var express = require('express'),
    app     = express(),
    PORT    = process.env.port || 8000;

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

app.listen(PORT, function() {
    console.log('Magic happens on port ' + PORT);
});
