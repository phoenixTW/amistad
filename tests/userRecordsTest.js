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
			it('retrieves two users',function (done){
				var callback = function(err,users){
					var expected = [ { 
						firstname: 'Kaustav',
						lastname: 'Chakraborty',
						email_id: 'kaustav.ron@gmail.com',
						password: '12345',
						username: 'kaustavRon',
						birthday: '24-01-1994',
						gender: 'male' },
						{ firstname: 'Prasenjit',
						lastname: 'Chakraborty',
						email_id: 'prasenjitc@gmail.com',
						password: '54321',
						username: 'prasen',
						birthday: '01-12-1993',
						gender: 'male' } ];
					assert.notOk(err);
					assert.lengthOf(users,2);
					assert.deepEqual(users, expected);
					done();
				};
				
				userRecords.getUsers(callback);
			})
		});

		describe('#getSingleUser',function(){
			it('should give the details of kaustav.ron@gmail.com',function (done){
				var callback = function(err,user){
					var expected = {
						  "birthday": "24-01-1994",
						  "gender": "male",
						  "firstname": "Kaustav",
						  "lastname": "Chakraborty",
						  "username": "kaustavRon"
						};
					assert.notOk(err);
					assert.deepEqual(user, expected);
					done();
				};
				
				userRecords.getSingleUser('kaustav.ron@gmail.com', callback);
			});

			it('should give the details of wrongID@gmail.com',function (done){
				var callback = function(err,user){
					assert.notOk(err);
					assert.deepEqual(user, undefined);
					done();
				};
				
				userRecords.getSingleUser('wrongID@gmail.com', callback);
			});
		});

		describe('#insertPost', function() {
			it('should insert hello for kaustav.ron@gmail.com into posts table', function (done) {

				var getPostsCallBack = function (error, posts) {
					assert.notOk(error);
					assert.deepEqual(posts, collectionOfPost);
					done();
				};

				var callback = function (err) {
					assert.notOk(err);
					userRecords.getPosts(getPostsCallBack);
				};

				var insertedPost = {
					description: 'hello',
					date: '4 jun 2014',
					from: 'kaustav.ron@gmail.com',
					senderName: 'Kaustav Chakraborty'
				};

				var collectionOfPost = [ { id: 1,
					post: 'hello World',
					date: '29 may 2014',
					name: 'Kaustav Chakraborty',
					email_id: 'kaustav.ron@gmail.com' },
					{ id: 2,
					post: 'again hello World',
					date: '30 may 2014',
					name: 'Prasenjit Chakraborty',
					email_id: 'prasenjitc@gmail.com' },
					{ id: 3,
					post: 'hello',
					date: '4 jun 2014',
					name: 'Kaustav Chakraborty',
					email_id: 'kaustav.ron@gmail.com' } ];

				userRecords.insertPosts(insertedPost, callback);	
			});

			it('should return error for maheshkolla@gmail.com inserting something into posts table', function (done) {

				var callback = function (err) {
					assert.ok(err);
					done();
				};

				var insertedPost = {
					description: 'hello',
					date: '4 jun 2014',
					from: 'maheshkolla@gmail.com'
				};
				userRecords.insertPosts(insertedPost, callback);	
			});
		});
		
		describe('#getIndivisualPosts', function () {
			it('should return the posts made by kaustav.ron@gmail.com', function (done){
				var getPostsCallBack = function (error, posts) {
					assert.notOk(error);
					assert.deepEqual(posts, expectedPost);
					done();
				};

				var callback = function (err) {
					assert.notOk(err);
					userRecords.getIndivisualPosts('kaustav.ron@gmail.com', getPostsCallBack);
				};

				var insertedPost = {
					description: 'hello',
					date: '4 jun 2014',
					from: 'kaustav.ron@gmail.com',
					senderName: 'Kaustav Chakraborty'
				};

				var expectedPost = [
					{ post: 'hello World', date: '29 may 2014', name: 'Kaustav Chakraborty', email_id: 'kaustav.ron@gmail.com' },
					{ post: 'hello', date: '4 jun 2014', name: 'Kaustav Chakraborty', email_id: 'kaustav.ron@gmail.com' }
				];

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
			it('create a profile for Ananthu',function (done){
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

			it('Access denied for creating an account with existing email Id', function (done){
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

		describe('#getPassword', function() {
			it('retrieves the password of Kaustav Chakraborty by email_id', function (done) {
				var email_id = 'kaustav.ron@gmail.com';

				var callback = function (err, data) {
					assert.notOk(err);
					assert.deepEqual(data.password, '12345');
					done();
				};

				userRecords.getPassword(email_id, callback);
			});

			it('retrieves the password of Prasenjit Chakraborty by email_id', function (done) {
				var email_id = 'prasenjitc@gmail.com';

				var callback = function (err, data) {
					assert.notOk(err);
					assert.deepEqual(data.password, '54321');
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

		describe('#updatePassword', function() {
			it('update the password of Kaustav Chakraborty by email_id', function (done) {
				var email_id = 'kaustav.ron@gmail.com';
				var reqData = {reg_email_: email_id, password : '11111'};

				var onComplete = function(error) {

					assert.notOk(error);

					var callback = function (err, data) {
						assert.notOk(err);
						assert.deepEqual(data.password, '11111');
						done();
					};

					userRecords.getPassword(email_id, callback);
				};

				userRecords.updatePassword(reqData, onComplete);
			});

			it('update the password of Prasenjit Chakraborty by email_id', function (done) {
				var email_id = 'prasenjitc@gmail.com';
				var reqData = {reg_email_: email_id, password : '11111'};

				var onComplete = function(error) {

					assert.notOk(error);

					var callback = function (err, data) {
						assert.notOk(err);
						assert.deepEqual(data.password, '11111');
						done();
					};

					userRecords.getPassword(email_id, callback);
				};

				userRecords.updatePassword(reqData, onComplete);
			});
		});


		describe('#getUserName', function() {
			it('should return Kaustav Chakraborty for kaustav.ron@gmail.com', function (done) {
				var expName = { firstname: "Kaustav", lastname: "Chakraborty"};
				var callback = function (error, name) {
					assert.deepEqual(expName, name);
					done();
				};

				userRecords.getUserName('kaustav.ron@gmail.com', callback);
			});

			it('should return Prasenjit Chakraborty for prasenjitc@gmail.com', function (done) {
				var expName = {firstname: "Prasenjit", lastname: "Chakraborty"};
				var callback = function (error, name) {
					assert.deepEqual(expName, name);
					done();
				};

				userRecords.getUserName('prasenjitc@gmail.com', callback);
			});

			it('should return Error for wrongId@gmail.com', function (done) {
				var callback = function (error, name) {
					assert.notOk(error);
					assert.deepEqual(name, undefined);
					done();
				};

				userRecords.getUserName('wrongId@gmail.com', callback);
			});
		});

		describe('#updateBasic', function() {
			it('should update basic information for kaustav.ron@gmail.com', function (done) {
				var data = {
					email: 'kaustav.ron@gmail.com',
					firstname: 'Konko',
					lastname: 'Ch',
					nationality: 'Brazilian',
					state: 'UP',
					relStatus: 'single'
				};
				var callback = function (error, name) {
					assert.notOk(error);
					done();
				};

				userRecords.updateBasic(data.email, callback);
			});

			describe('#insertBasicInfo', function() {
				it('should insert basic information for prasenjitc@gmail.com', function (done) {
					var data = {
						email: 'prasenjitc@gmail.com',
						firstname: 'Konko',
						lastname: 'Ch',
						nationality: 'Brazilian',
						state: 'UP',
						relStatus: 'single'
					};
					var callback = function (error) {
						assert.notOk(error);
						done();
					};

					userRecords.insertBasicInfo(data, callback);
				});
			});
		});
	});
});