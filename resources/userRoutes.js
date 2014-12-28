//For Encryption
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");

//Database path
var dbMethods = require('./userRecords').methods.init('./data/users.db');
var lib = require('./librery');
var loggedUsers = {};

// exports.render = function (request, response, renderingPage) {
// 	response.render(renderingPage);
// };

exports.postLogin = function (request, response) {

    loggedUsers[request.body.username] = {
        cookies: request.cookies['connect.sid']
    };

    delete request.body.password;

    response.redirect('practice');
};

exports.logout = function (request, response) {
    
    var email = request.user.id;

    request.logout();
    delete loggedUsers[email];
    response.redirect('/');
};

exports.registerUser = function (request, response, next) {
	var userInfo = request.body;
	var invalidInsert = {
		message: 'Already has an account with this email id',
		nextAttempt: 'login'
	};


	userInfo.reg_passwd__ = SHA256(userInfo.reg_passwd__).words.join('');
	dbMethods.addRecords(userInfo,
	function(error){
		if(error){
			response.render('invalidAttempt', {invalidInsert: invalidInsert});
			return;
		}
		response.render('redirecting', {userInfo: userInfo});
	});

};

exports.loginUser = function (username, userPassword, done) {

    var invalidInsert = {
        message: 'Invalid email or password',
        nextAttempt: 'login'
    };

	dbMethods.getPassword(username, function (error, password) {

		userPassword = SHA256(userPassword).words.join('');
    
		if(!lib.comparePassword(userPassword, password.password, error)){
			done(null, null);
			return false;
		}

        done(null, {id: username, name: username});
        return true;
	});
};

exports.goToHome = function (request, response) {
	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts = posts.reverse();

			var callback = function (err, name) {
				response.render('practice', {email: request.user.id, name: name.name, posts: posts});
			};
			
			dbMethods.getUserName(request.user.name, callback);
		}
	};


	dbMethods.getIndivisualPosts(request.user.name, onComplete);
};

exports.uploadComment = function (request, response, next) {
	var data = {
		description: request.body.msg,
		date: new Date(),
		from: request.user.name
	};

	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts = posts.reverse();
			response.render('comments', {posts: posts});
		}
	};

	var callback = function (err) {
		dbMethods.getIndivisualPosts(request.user.name, onComplete)
	}
	dbMethods.insertPosts(data, callback);
};

exports.getFriends = function (request, response) {
	response.render('friends');	
};

exports.getEditProfile = function (request, response) {
	response.render('editProfile');
};

//reseting the password

exports.resetPassword = function (request, response) {
	var userPwdData = request.body;
	var oldPassword = SHA256(userPwdData.oldPwd).words.join('');

	var uPwdCallback = function (error) {
		error && response.render('editProfile', {message: 'Unable to access'});
		!error && response.render('editProfile', {message: 'Password Updated Successfully'});
	};

	var getPwdCallback = function (error, passwordObj) {
		if(lib.comparePassword(oldPassword, passwordObj.password, error) && 
			lib.comparePassword(userPwdData.newPwd, userPwdData.newPwdRpt, error)){
			var newPassword = SHA256(userPwdData.newPwd).words.join('');
			var reqData = {reg_email_ : request.user.id, password : newPassword};
			dbMethods.updatePassword(reqData, uPwdCallback);
			return;
		}
		
		response.render('editProfile', {message: 'Password didn`t matched'});
	};
	dbMethods.getPassword(request.user.id, getPwdCallback);
};