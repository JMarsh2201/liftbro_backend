const express = require('express');
const path = require('path');
const cluster = require('cluster');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const numCPUs = require('os').cpus().length;
const router = express.Router();

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/liftbro_api';
const MONGO_OPTS = {useNewUrlParser: true}
const BP_OPTS = {extended: true}

mongoose.connect(DB, MONGO_OPTS);

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Cluster buster ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  app.use(bodyParser.urlencoded(BP_OPTS));
  app.use(bodyParser.json());

  router.use( function ( req, res, next ) {
  	console.log('Something is happening.');
  	next();
  } );

  router.get( '/', function ( req, res ) {
  	res.json( {
  		message: 'hooray! welcome to our api!'
  	});
  });

  const groupRoutes = require('./routes/group.js')
  groupRoutes(router)


  // Answer API requests.
  app.use('/api', router );

  app.listen(PORT, () => {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
