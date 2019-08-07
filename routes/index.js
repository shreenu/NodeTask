var express = require('express');
var router = express.Router();
const envParser = require('../controllers/envParser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'dotEnvParser' });
});

router.get('/getEnvironment/:process', envParser.getEnvironment);

router.get(
  '/setEnvironment/:process/:key/:value',
  envParser.setEnvironment,
);

router.get('/getList', envParser.getList);

module.exports = router;
