//Routes Articles

const express = require('express');
const router = express.Router();

//import model
let Article = require('../models/article');
let User = require('../models/user');

const ArticleController = require('../controller/ArticleController');

router.get('/add', ensureAuthenticated, ArticleController.add_form);
router.post('/add', ensureAuthenticated, ArticleController.add_action);

// router.get('/edit/:id', ArticleController.edit_form);
// router.post('/edit/:id', ArticleController.edit_action);

router.get('/remove/:id', ensureAuthenticated, ArticleController.delete);

router.get('/:id', ArticleController.view);



//load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Article.findById(req.params.id, function(err, articles){
		if(articles.author == req.user.id){
			res.render('article/edit_article', {
				header:'Edit',
				articles:articles
			});					
		}else {
			req.flash('danger','Access denied!');
			res.redirect('/');
		}
	});
});

router.post('/edit/:id', ensureAuthenticated, function(req,res){
	let article = {};
	
	article.title = req.body.title;
	article.author = req.user.id;
	article.body = req.body.body;

	let query = {_id:req.params.id};

	Article.update(query, article, function(err){
		if (err) {
			console.log(err);
			return;
		}else {
			req.flash('info','Articles Updated');
			res.redirect('/');
		}
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		req.flash('danger', 'Login first!');
		res.redirect('/users/login');
	}
}

module.exports = router;