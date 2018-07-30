//Routes Articles

const express = require('express');
const router = express.Router();

//import model
let Article = require('../models/article');
let User = require('../models/user');

const ArticleController = require('../controller/ArticleController');

router.get('/add', ensureAuthenticated, ArticleController.add_form);
router.post('/add', ensureAuthenticated, ArticleController.add_action);

router.get('/edit/:id', ensureAuthenticated, ArticleController.edit_form);
router.post('/edit/:id', ensureAuthenticated, ArticleController.edit_action);

router.get('/remove/:id', ensureAuthenticated, ArticleController.delete);

router.get('/:id', ArticleController.view);


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		req.flash('danger', 'Login first!');
		res.redirect('/users/login');
	}
}

module.exports = router;