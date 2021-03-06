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

	var callback = function (err, name) {
	    loggedUsers[request.body.username] = {
	    	firstname: name.firstname,
	    	lastname: name.lastname,
	        cookies: request.cookies['connect.sid']
	    };

	    delete request.body.password;

	    response.redirect('practice');
	};
	
	dbMethods.getUserName(request.body.username, callback);

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
    
		if(password == undefined || !lib.comparePassword(userPassword, password.password, error)){
			done(null, null);
			return false;
		}

		else{
        	done(null, {id: username, name: username});
        	return true;
        }
	});
};

exports.goToHome = function (request, response) {
	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts = posts.reverse();

			response.render('practice', 
				{
					email: request.user.id, 
					firstname: loggedUsers[request.user.id].firstname,
					lastname: loggedUsers[request.user.id].lastname,
					posts: posts
				}
			);
		}
	};


	dbMethods.getPosts(onComplete);
};

exports.uploadComment = function (request, response, next) {
	var data = {
		description: request.body.msg,
		date: new Date(),
		from: request.user.name,
		senderName: loggedUsers[request.user.id].firstname + 
			' ' + loggedUsers[request.user.id].lastname,
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
	renderEditProfile(request, response);
};

//EditProfile Rendering

var renderEditProfile = function (request, response, message) {
	var data = {
		email: request.user.id, 
		message: message,
		firstname: loggedUsers[request.user.id].firstname,
		lastname: loggedUsers[request.user.id].lastname
	};


	dbMethods.getBasicInfo(data.email, function (error, info) {
		data.nationality = info && info.nationality || undefined;
		data.state = info && info.state || undefined;
		response.render('editProfile', data);
	});

};

//reseting the password

exports.resetPassword = function (request, response) {
	var userPwdData = request.body;
	var oldPassword = SHA256(userPwdData.oldPwd).words.join('');

	var uPwdCallback = function (error) { //Callback for #updatePassword
		error && renderEditProfile(request, response, 'Unable to access');
		!error && renderEditProfile(request, response, 'Password Updated Successfully');
	};

	var getPwdCallback = function (error, passwordObj) {
		if(lib.comparePassword(oldPassword, passwordObj.password, error) && 
			lib.comparePassword(userPwdData.newPwd, userPwdData.newPwdRpt, error)){
			var newPassword = SHA256(userPwdData.newPwd).words.join('');
			var reqData = {reg_email_ : request.user.id, password : newPassword}; //Passing email and password
			dbMethods.updatePassword(reqData, uPwdCallback);
		}

		else
			renderEditProfile(request, response, 'Password didn`t matched');
	};
	dbMethods.getPassword(request.user.id, getPwdCallback);
};

//Upadte Personal Information

exports.updatePersonalInfo = function (request, response) {
	var data = {
		email: request.user.id,
		firstname: request.body.first_name,
		lastname: request.body.last_name,
		nationality: request.body.nationality,
		state: request.body.state,
		relStatus: request.body.rel
	};

	var onComplete = function (error) {
		dbMethods.getBasicInfo(data.email, function (error, basicData) {

			error || basicData == null && dbMethods.insertBasicInfo(data, function (err){
				response.redirect('/practice');
			});

			!error && basicData != null && response.redirect('/editProfile');
		});
	};
	
	dbMethods.updateBasic(data, onComplete);
};

//Go to profileInfo

var userInformations = function (request, response, renderPage, method) {
	var askedEmail = request.params.id;
	var data = {
		askedEmail: askedEmail,
		email: request.user.id,
		firstname: loggedUsers[request.user.id].firstname,
		lastname: loggedUsers[request.user.id].lastname
	};

	var populateData = function (info, whatInfo) {
		data[whatInfo] = info;
		return true;
	};

	var callback = function (error, info) {
		error && response.render(renderPage, {message: 'Unable To Access'});
		!error && populateData(info, 'user') && dbMethods.getBasicInfo(askedEmail, onComplete);
	};

	var onComplete = function (err, basicInfo) {
		err && response.render(renderPage, {message: 'Unable To Access'});
		
		if(method && !err) {
			method(response, askedEmail, data, renderPage, basicInfo);
			return;
		}

		!err && populateData(basicInfo, 'basic') && response.render(renderPage, data);
	};

	dbMethods.getSingleUser(askedEmail, callback);
};

exports.profileInfo = function (request, response) {
	userInformations(request, response, 'profileInfo')
};

//Go to Profile Page 
exports.profile = function (request, response) {
	userInformations(request, response, 'profile', getPosts);
};

var getPosts = function (response, email, data, page, basicInfo) {
	data.basic = basicInfo;
	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts = posts.reverse();
			data.posts = posts;
			response.render(page, data);
		}
	};


	dbMethods.getIndivisualPosts(email, onComplete);
};