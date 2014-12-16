var lib = {};
exports.lib = lib;

lib.compareEmails = function (mainEmail, confirmEmail) {
	if (confirmEmail != mainEmail || 
		confirmEmail.length == 0 ||
		!lib.isClientValid(mainEmail)){ 
			return false;
	}
	
	return true;
};

lib.isClientValid = function (email) {
	var clients = {'gmail.com' : true, 'yahoo.com' : true, 'hotmail.com' : true};
	var userClient = email.split('@')[1];
	return (clients[userClient]) || false;
};

lib.dateVarification = function (day, month, year) {
	return (lib.isDateValid(day, month, year));
};

lib.isDateValid = function (day, monthByUser, year) {
	var currentYear = new Date().getFullYear();

	if(day > 31 || day < 1 ||
		 monthByUser > 12 || monthByUser < 1 ||
		 year > currentYear - 18 || year < 1950) {
		return false;
	}

	var isValid = true;
	[2, 4, 6, 9, 11].forEach(function (month) {
		if(month == monthByUser && day > 30){
			isValid = false;
		}
	});

	if(isValid && monthByUser == 2) {
			isValid = lib.checkLeapYear(day, year);
	}

	return isValid;
};

lib.checkLeapYear = function (day, year) {
	
	return ((year % 100 == 0 && year % 400 == 0) || (year % 100 != 0 && year % 4 == 0)) && day <= 29 || day <= 28;
};

lib.checkAllValidations = function (email, confirmEmail, day, month, year) {
	return lib.compareEmails(email, confirmEmail) && lib.dateVarification(day, month, year) || false;
};