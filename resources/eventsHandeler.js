var dbMethods = require('./userRecords').methods.init('../data/school.db');
var events = {};
exports.events = events;

events.fillRecords = function (userData) {
	dbMethods.addRecords(query);
};
	// var query = ["insert into information (name, email_id, password, username, birthday, gender) values(?,?,?,?,?,?)", 
	// 				[userData.firstname + ' ' + userData.lastname, userData.reg_email_, userData.reg_passwd__, 
	// 				 userData.username, userData.day + userData.month + userData.year, userData.sex]
	// 			]; 


