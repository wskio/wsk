var express = require('express');
var path = require('path');
var http = require('http');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8889);
  app.use(express.static(path.join(__dirname, 'public')));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//coment
