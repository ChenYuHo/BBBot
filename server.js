var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var router = express();
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
router.use(bodyParser.json({
  limit: '50mb'
}));
var server = http.createServer(router);
router.use(express.static(path.join(__dirname, 'client')));
router.post('/zenbot', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, routes.zenbot);
console.log(process.env)
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("BBBOT server listening at", addr.address + ":" + addr.port);
});