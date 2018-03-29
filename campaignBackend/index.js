const express = require("express")
const app = express();
const port = process.env.PORT || 9001;
const routes = require("./routes");
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:2345");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(routes);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({"error" : err.stack});
})


app.listen(port, function(){
  console.log('Server running on port %d', port);
});
