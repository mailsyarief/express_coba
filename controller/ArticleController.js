//Controller Article

const express = require('express');
const router = express.Router();

//import model
let Article = require('../models/article');
let User = require('../models/user');


exports.add_form = function(req, res){
	res.render('article/add_articles', {
		title:'Add',
		header:'Add articles'
	});
};

exports.add_action = function(req,res){
	req.checkBody('title','Title is required').notEmpty();
	// req.checkBody('author','Author is required').notEmpty();
	req.checkBody('body','Body is required').notEmpty();

	let errors = req.validationErrors();

	if (errors) {
		res.render('add_articles', {
			title:'Add',
			header:'Add articles',
			errors:errors
		});
	}else {
		let article = new Article();
		article.title = req.body.title;
		article.author = req.user.id;
		article.body = req.body.body;
		article.save(function(err){
			if (err) {
				console.log(err);
				return;
			}else {
				req.flash('success','Articles Added');
				res.redirect('/');
			};
		});	
	};

};

exports.view = function(req, res){
	Article.findById(req.params.id, function(err, articles){
		User.findById(articles.author, function(err, user){
			res.render('article/article', {
				articles:articles,
				author: user.name
			});					
		});
	});
};



exports.edit_from = function(req, res){
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
};


exports.edit_action = function(req,res){
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
};


exports.delete = function(req,res){
	let query = {_id:req.params.id}
	Article.findById(req.params.id, function(err, articles){
		if(articles.author == req.user.id){
			Article.remove(query, function(err){
				if (err) {
					console.log(err);
				}
				req.flash('warning','Articles Deleted');
				res.redirect('/');
			});		
		}else {
			req.flash('danger','Access denied!');
			res.redirect('/');
		}
	});	
};

//delete route
// router.delete('/:id', function(req,res){
// 	if (!req.user.id) {
// 		res.status(500).send();
// 	}

// 	let query = {_id:req.params.id}

// 	Article.remove(query, function(err){
// 		if (err) {
// 			console.log(err);
// 		}
// 		res.send('Success');
// 	});
// });