var assert = require('chai').assert;
var lib = require('../../resources/amistadLib.js').lib;
var librery = require('../../resources/librery.js');

console.log('--------------AmistadAllLibTest------------------');

suite('##amistadLib', function() {
	suite('HTML javascript validations', function () {
		suite('#compareEmails()', function () {
			test('should return true when email and confirm emails are same', function () {
				var email = 'kaustav.ron@gmail.com';
				var confirmEmail = 'kaustav.ron@gmail.com';
				assert.equal(lib.compareEmails(email, confirmEmail), true);
			});

			test('should return false when email and confirm emails are not same', function () {
				var email = 'kaustav.ron@gmail.com';
				var confirmEmail = 'ananthu@gmail.com';
				assert.equal(lib.compareEmails(email, confirmEmail), false);
			});
		});

		suite('#isClientValid()', function () {
			test('should return true for kaustav.ron@gmail.com', function () {
				var email = 'kaustav.ron@gmail.com';
				assert.equal(lib.isClientValid(email), true);
			});

			test('should return true for kaustav.ron@yahoo.com', function () {
				var email = 'kaustav.ron@yahoo.com';
				assert.equal(lib.isClientValid(email), true);
			});

			test('should return true for kaustav.ron@hotmail.com', function () {
				var email = 'kaustav.ron@hotmail.com';
				assert.equal(lib.isClientValid(email), true);
			});

			test('should return false for kaustav.ron@thoughtworks.com', function () {
				var email = 'kaustav.ron@thoughtworks.com';
				assert.equal(lib.isClientValid(email), false);
			});
		});

		suite('#dateVarification()', function () {
			test('should return true for 31/12/1994', function () {
				var day = 31;
				var month = 12;
				var year = 1994;
				assert.equal(lib.dateVarification(day, month, year), true);
			});

			test('should return false for 31/12/2014', function () {
				var day = 31;
				var month = 12;
				var year = 2014;
				assert.equal(lib.dateVarification(day, month, year), false);
			});
		});

		suite('#isDateValid()', function () {
			test('should return true for 31/12/1994', function () {
				var day = 31;
				var month = 12;
				var year = 1994;
				assert.equal(lib.isDateValid(day, month, year), true);
			});

			test('should return false for 31/12/2014', function () {
				var day = 31;
				var month = 12;
				var year = 2014;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 32/12/1994', function () {
				var day = 32;
				var month = 12;
				var year = 1994;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 0/12/1994', function () {
				var day = 0;
				var month = 12;
				var year = 1994;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return true for 29/02/1996', function () {
				var day = 29;
				var month = 02;
				var year = 1996;
				assert.equal(lib.isDateValid(day, month, year), true);
			});

			test('should return false for 29/02/1997', function () {
				var day = 29;
				var month = 02;
				var year = 1997;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 29/02/1949', function () {
				var day = 28;
				var month = 02;
				var year = 1949;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 31/04/1992', function () {
				var day = 31;
				var month = 04;
				var year = 1992;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 31/06/1992', function () {
				var day = 31;
				var month = 06;
				var year = 1992;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 31/09/1992', function () {
				var day = 31;
				var month = 09;
				var year = 1992;
				assert.equal(lib.isDateValid(day, month, year), false);
			});

			test('should return false for 31/11/1992', function () {
				var day = 31;
				var month = 11;
				var year = 1992;
				assert.equal(lib.isDateValid(day, month, year), false);
			});
		});

		suite('#checkLeapYear()', function () {
			test('should return true for DD/02/2012', function () {
				var day = 29,
					year = 2012;
				assert.equal(lib.checkLeapYear(day, year), true);
			});

			test('should return false for DD/02/2014', function () {
				var day = 29,
					year = 2014;
				assert.equal(lib.checkLeapYear(day, year), false);
			});
		});

		suite('#checkAllValidations()', function () {
			test('should return true for 20/02/1990 and same email', function () {
				var day = 20,
					month = 02
					year = 1990,
					email = 'kaustav.ron@gmail.com',
					confirmEmail = 'kaustav.ron@gmail.com';
				assert.equal(lib.checkAllValidations(email, confirmEmail, day, month, year), true);
			});

			test('should return false for 29/02/2014 but same email', function () {
				var day = 29,
					month = 02,
					year = 2014,
					email = 'kaustav.ron@gmail.com',
					confirmEmail = 'kaustav.ron@gmail.com';
				assert.equal(lib.checkAllValidations(email, confirmEmail, day, month, year), false);
			});

			test('should return false for 20/02/1990 but different emails', function () {
				var day = 20,
					month = 02
					year = 1990,
					email = 'kaustav.ron@gmail.com',
					confirmEmail = 'ananthu@gmail.com';
				assert.equal(lib.checkAllValidations(email, confirmEmail, day, month, year), false);
			});

			test('should return false for 29/02/2014 and different email', function () {
				var day = 29,
					month = 02,
					year = 2014,
					email = 'kaustav.ron@gmail.com',
					confirmEmail = 'ananthu@gmail.com';
				assert.equal(lib.checkAllValidations(email, confirmEmail, day, month, year), false);
			});

		});

	});
});


suite('##librery', function() {
	suite('UserRoutes Password Comparism', function () {
		suite('#comparePassword()', function () {
			test('should return true when 12345 and 12345 are matched', function () {
				var password = '12345';
				var confirmPassword = '12345';
				assert.equal(librery.comparePassword(password, confirmPassword), true);
			});

			test('should return false when 12345 and 54321 are not matched', function () {
				var password = '12345';
				var confirmPassword = '54321';
				assert.equal(librery.comparePassword(password, confirmPassword), false);
			});

			test('should return false when 12345 and 12345 are matched but error occured', function () {
				var password = '12345';
				var confirmPassword = '12345';
				var error = new Error('I have an error');
				assert.equal(librery.comparePassword(password, confirmPassword, error), false);
			});

			test('should return false when 12345 and 54321 are not matched and error occured', function () {
				var password = '12345';
				var confirmPassword = '54321';
				var error = new Error('I have an error');
				assert.equal(librery.comparePassword(password, confirmPassword, error), false);
			});

			test('should return false when password is undefined and no error occured', function () {
				var password = undefined;
				var confirmPassword = '54321';
				assert.equal(librery.comparePassword(password, confirmPassword), false);
			});

			test('should return false when password is undefined and error occured', function () {
				var password = undefined;
				var confirmPassword = '54321';
				var error = new Error('I have an error');
				assert.equal(librery.comparePassword(password, confirmPassword, error), false);
			});
		});
	});
});

