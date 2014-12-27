var sqlite3 = require('sqlite3');
var dbMethods = {};

exports.methods = dbMethods;

var insertQueryMaker = function (tableName, data, fields) {
	var columns = fields && ' (' + fields.join(', ') + ')' || '';
	var values = '"' + data.join('", "') + '"';
	var query = 'insert into ' + tableName + columns + ' values(' + values + ');';
	return query;
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
	select(db, onComplete, 'information', 'all');
};


var addUser = function (userData, db, onComplete) {
	var bday = userData.day + '' + userData.month + '' + userData.year;
	var name = userData.firstname + ' ' + userData.lastname;

	var fields = ['name', 'email_id', 'password', 'username', 'birthday', 'gender'];
	var data = [name, userData.reg_email_, userData.reg_passwd__, userData.username, bday, userData.sex];

	insertInto(db, fields, data, 'information', onComplete);
};

var retrieveWhereToGet = function (resource) {
	var whereToGet = Object.keys(resource).map(function (key) {
		return key + ' = "' + resource[key] + '"';
	}).join(' and ');

	return ' where ' + whereToGet;
};

var _insertPosts = function(data, db, onComplete){
	var fields = ['post', 'date', 'email_id'];
	var data = [data.description, data.date, data.from];
	insertInto(db, fields, data, 'posts', onComplete);
};

var _getPosts = function (db, onComplete) {
	select(db, onComplete, 'posts', 'all');
};

var retrievePassword = function (email_id, db, onComplete) {
	var whereToGet = {email_Id: email_id};
	select(db, onComplete, 'information', 'get', ['password'], whereToGet);
};

var _getIndivisualPosts = function (email_id, db, onComplete) {
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'posts', 'all', ['post', 'date', 'email_id'], whereToGet);
};

var _getUserName = function (email_id, db, onComplete) {
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'information', 'get', ['name'], whereToGet);
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

				if(err){onComplete(err); return;}
				if(typeof onComplete == 'string') { console.log(err);operation(db, onComplete); return;};
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
		getUserName: operate(_getUserName)
	};

	return records;
};

dbMethods.init = init;