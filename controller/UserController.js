// Controller User

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//import model
let Users = require('../models/user');
let Article = require('../models/article');

exports.register_form = function(req, res){
	res.render('user/user_register');
};

exports.register_action = function(req, res){

	//menangkap value dari form
	const name = req.body.name;
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const password2 = req.body.password2;

	//validasi input
	req.checkBody('name', 'Name is Required').notEmpty();
	req.checkBody('username', 'Username is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is Required').notEmpty();
	req.checkBody('password2', 'Password do not match').equals(req.body.password);

	let errors = req.validationErrors();

	if (errors) {
		res.render('user/user_register',{
			errors:errors
		});
	}else {
		let newUser = new Users({
			name:name,
			email:email,
			username:username,
			password:password
		});

		//merubah password -> hash dengan bcrypt
		bcrypt.genSalt(10, function(err,salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				if (err) {
					console.log(err);
				}
				newUser.password = hash;
				newUser.save(function(err){
					if (err) {
						console.log(err);
						return;
					}else {
						req.flash('success', 'User registered, now you can login');
						res.redirect('/users/login');
					}
				})
			});
		});
	}
};

exports.login_form = function(req, res){
	res.render('user/user_login');
};

exports.login_action = function(req, res, next){
	//validasi login
	passport.authenticate('local',{
		successRedirect:'/',
		failureRedirect:'/users/login',
		failureFlash: true
	})(req, res, next);	
};

exports.logout = function(req, res){
	//logout
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/users/login');
};



