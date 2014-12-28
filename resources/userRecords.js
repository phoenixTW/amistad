var sqlite3 = require('sqlite3');
var dbMethods = {};

exports.methods = dbMethods;

var insertQueryMaker = function (tableName, data, fields) {
	var columns = fields && ' (' + fields.join(', ') + ')' || '';
	var values = '"' + data.join('", "') + '"';
	var query = 'insert into ' + tableName + columns + ' values(' + values + ');';
	return query;
};

var retrieveWhereToGet = function (resource) {
	var whereToGet = Object.keys(resource).map(function (key) {
		return key + ' = "' + resource[key] + '"';
	}).join(' and ');

	return ' where ' + whereToGet;
};

var selectQueryMaker = function (tableName, retrivalData, where) {
	retrivalData = retrivalData || ['*'];
	var whatToGet = retrivalData.join(', ');
	var whereToGet = where && retrieveWhereToGet(where) || '';

	var query = 'select ' + whatToGet + ' from ' + tableName + whereToGet + ';';
	return query;
};

var insertInto = function (db, fields, data, tableName, onComplete) {
	var query = insertQueryMaker(tableName, data, fields);
	db.run(query, onComplete);
};


var select = function (db, onComplete, tableName, retriveMethod, retrivalData, where) {
	var query = selectQueryMaker(tableName, retrivalData, where);
	db[retriveMethod](query, onComplete);
};

var retrieveUsersRecords = function(db,onComplete){
	select(db, onComplete, 'user', 'all');
};

var _getSingleUser = function (email, db, onComplete) {
	var whereToGet = {email_id: email};
	var whatToGet = ['firstname', 'lastname', 'username', 'gender', 'birthday'];
	select(db, onComplete, 'user', 'get', whatToGet, whereToGet);
};

var addUser = function (userData, db, onComplete) {
	var bday = userData.day + '-' + userData.month + '-' + userData.year;
	var fields = ['firstname', 'lastname', 'email_id', 'password', 'username', 'birthday', 'gender'];
	var data = [userData.firstname, userData.lastname, userData.reg_email_, userData.reg_passwd__, userData.username, bday, userData.sex];

	insertInto(db, fields, data, 'user', onComplete);
};


var _insertPosts = function(data, db, onComplete){
	var fields = ['post', 'date', 'name', 'email_id'];
	var data = [data.description, data.date, data.senderName, data.from];
	insertInto(db, fields, data, 'posts', onComplete);
};

var _getPosts = function (db, onComplete) {
	select(db, onComplete, 'posts', 'all');
};

var retrievePassword = function (email_id, db, onComplete) {
	var whereToGet = {email_Id: email_id};
	select(db, onComplete, 'user', 'get', ['password'], whereToGet);
};

var _getIndivisualPosts = function (email_id, db, onComplete) {
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'posts', 'all', ['post', 'date', 'name', 'email_id'], whereToGet);
};

var _getUserName = function (email_id, db, onComplete) {
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'user', 'get', ['firstname', 'lastname'], whereToGet);
};

var _getBasicInfo = function (email_id, db, onComplete) {
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'basicinfo', 'get', ['nationality', 'state', 'relationship'], whereToGet);
};

var _updatePassword = function (data, db, onComplete) {
	var query = 'update user set password = "' + data.password +
			'" where email_id = "' + data.reg_email_ + '";';
	db.run(query, onComplete);
};

var _updateBasic = function (data, db, onComplete) {
	var updateName = 'update user set firstname = "' + data.firstname +
		'", lastname = "' + data.lastname +
		'" where email_id = "' + data.email + '";';
	console.log(updateName);
	db.run(updateName, function (err) {
		var updateBasicInfo = 'update basicinfo set nationality = "' + data.nationality +
			'", state = "' + data.state + '", relationship = "' + data.relStatus +
			'" where email_id = "' + data.email + '";';
		db.run(updateBasicInfo, onComplete);
	});
};

var _insertBasicInfo = function (data, db, onComplete) {
	var fields = ['email_id', 'nationality', 'state', 'relationship'];
	var whatToInsert = [data.email, data.nationality, data.state, data.relStatus];
	insertInto(db, fields, whatToInsert, 'basicinfo', onComplete);
};

dbMethods.queryParser = {
	selectQueryMaker: selectQueryMaker,
	insertQueryMaker: insertQueryMaker
};


dbMethods.queryHandler = {
	select: select,
	insertInto: insertInto
};

var init = function(location){
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2) ? arguments[1] : arguments[0];
			var arg = (arguments.length == 2) && arguments[0];
			var onDBOpen = function(err){

				if(err){
					onComplete(err);
					return;
				}
				
				if(typeof onComplete == 'string') { 
					operation(db, onComplete);
					return;
				}

				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};

			var db = new sqlite3.Database(location,onDBOpen);
		};
	};

	var records = {		
		getUsers: operate(retrieveUsersRecords),
		addRecords: operate(addUser),
		getPassword: operate(retrievePassword),
		insertPosts: operate(_insertPosts),
		getPosts: operate(_getPosts),
		getIndivisualPosts: operate(_getIndivisualPosts),
		getUserName: operate(_getUserName),
		updatePassword: operate(_updatePassword),
		updateBasic: operate(_updateBasic),
		insertBasicInfo: operate(_insertBasicInfo),
		getBasicInfo: operate(_getBasicInfo),
		getSingleUser: operate(_getSingleUser)
	};

	return records;
};

dbMethods.init = init;