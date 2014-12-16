var module = require('../resources/userRecords').methods;
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/users.db.backup');

console.log('------------------ UserRecordsTest --------------------------');

var userRecords;
describe('users',function(){
	beforeEach(function(){
		fs.writeFileSync('tests/data/users.db',dbFileData);
		userRecords = module.init('tests/data/users.db');
	});

	describe('userRecords',function(){	
		describe('#getUsers',function(){
			it('retrieves two users',function(done){
				var callback = function(err,users){
					var expected = [{
						  "birthday": "24011994",
						  "email_id": "kaustav.ron@gmail.com",
						  "gender": "male",
						  "name": "Kaustav Chakraborty",
						  "password": "12345",
						  "username": "kaustavRon"
						},
						{
						  "birthday": "1121993",
						  "email_id": "prasenjitc@gmail.com",
						  "gender": "male",
						  "name": "Prasenjit Chakraborty",
						  "password": "54321",
						  "username": "prasen"}];

					assert.notOk(err);
					assert.lengthOf(users,2);
					assert.deepEqual(users, expected);
					done();
				};
				
				userRecords.getUsers(callback);
			})
		});

		describe('#insertPost', function() {
			it('should insert hello for kaustav.ron@gmail.com into posts table', function () {
				var callback = function (err) {
					assert.notOk(err);
				};

				var insertedPost = {
					description: 'hello',
					date: '4 jun 2014',
					from: 'kaustav.ron@gmail.com'
				};
				// assert.deepEqual(module.queryParser.insertQueryMaker('tableName', ['value1', 'value2'], ['field1', 'field2']), expectedQuery);
				// var fields = ['hello', '4 jun 2014', 'kaustav.ron@gmail.com'];
				// var insertPostQuery = module.queryParser.insertQueryMaker('posts', ['post', 'date', 'email_id'], fields);
				userRecords.insertPosts(insertedPost, callback);	
			});
		});
	});

	describe('queryParser', function () {
		describe('#selectQueryMaker', function() {
			it('should return select * from tableName if no data is given', function () {
				var expectedQuery = 'select * from tableName;';
				assert.deepEqual(module.queryParser.selectQueryMaker('tableName'), expectedQuery);
			});

			it('should return select field from tableName if field is given as select object', function () {
				var expectedQuery = 'select field from tableName;';
				assert.deepEqual(module.queryParser.selectQueryMaker('tableName', ['field']), expectedQuery);
			});

			it('should return select field from tableName where email = "kaustav.ron@gmail.com" if field is given as select object', function () {
				var expectedQuery = 'select field from tableName where email = "kaustav.ron@gmail.com";';
				assert.deepEqual(module.queryParser.selectQueryMaker('tableName', ['field'], {email: 'kaustav.ron@gmail.com'}), expectedQuery);
			});

			it('should return select field1, field2 from tableName where email = "kaustav.ron@gmail.com" and name = "Kaustav Chakraborty" if field is given as select object', function () {
				var expectedQuery = 'select field1, field2 from tableName where email = "kaustav.ron@gmail.com" and name = "Kaustav Chakraborty";';
				assert.deepEqual(module.queryParser.selectQueryMaker('tableName', ['field1', 'field2'], {
					email: 'kaustav.ron@gmail.com',
					name: 'Kaustav Chakraborty'
				}), expectedQuery);
			});
		});

		describe('#insertQueryMaker', function() {
			it('should return insert into tableName values ("value1", "value2") if no data is given', function () {
				var expectedQuery = 'insert into tableName values("value1", "value2");';
				assert.deepEqual(module.queryParser.insertQueryMaker('tableName', ['value1', 'value2']), expectedQuery);
			});

			it('should return insert into (field1, field2) tableName values ("value1", "value2") if field is given as select object', function () {
				var expectedQuery = 'insert into tableName (field1, field2) values("value1", "value2");';
				assert.deepEqual(module.queryParser.insertQueryMaker('tableName', ['value1', 'value2'], ['field1', 'field2']), expectedQuery);
			});
		});

	});

	describe('userRecords',function(){	
		describe('#addRecords',function(){
			it('create a profile for Ananthu',function(done){
				var records = {
					firstname: 'Ananthu',
					lastname: 'RV',
					reg_email_: 'ananthu@gmail.com',
					reg_passwd__:'11111111',
					username: 'Ananthu',
					day: 01,
					month: 01,
					year: 1994,
					sex: 'male'
				};

				var callback = function(err,user){
					assert.notOk(err);
					done();
				};
				userRecords.addRecords(records, callback);
			});

			it('Access denied for creating an account with existing email Id',function(done){
				var records = {
					firstname: 'Radhey',
					lastname: 'Deshkar',
					reg_email_: 'ananthu@gmail.com',
					reg_passwd__:'11111111',
					username: 'Radhey',
					day: 02,
					month: 02,
					year: 1993,
					sex: 'male'
				};

				var callback = function(err,user){
					assert.notOk(err);
					done();
				};
				userRecords.addRecords(records, callback);
			});
		});

		describe('#retrievePassword', function() {
			it('retrieves the password of Kaustav Chakraborty by email_id', function (done) {
				var email_id = 'kaustav.ron@gmail.com';

				var callback = function (err, password) {
					assert.notOk(err);
					assert.deepEqual(password.password, '12345');
					done();
				};

				userRecords.getPassword(email_id, callback);
			});

			it('retrieves the password of Prasenjit Chakraborty by email_id', function (done) {
				var email_id = 'prasenjitc@gmail.com';

				var callback = function (err, password) {
					assert.notOk(err);
					assert.deepEqual(password.password, '54321');
					done();
				};
				userRecords.getPassword(email_id, callback);
			});

			it('retrieves the password of unauthourised user is denied for wrong email_id', function (done) {
				var email_id = 'saylikadam@gmail.com';

				var callback = function (err, password) {
					assert.notOk(err);
					done();
				};
				userRecords.getPassword(email_id, callback);
			});
		});

	});
});