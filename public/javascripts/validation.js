var emailsMatching = function () {
    var confirmEmail = document.getElementById("email_confirmation").value;
    var mainEmail = document.getElementById("email").value;

	if (confirmEmail != mainEmail || 
		confirmEmail.length == 0 ||
		!isClientValid(mainEmail)){ 
			return changeColor('report', 'red', '&#x2716') && false;
	}
	
	return changeColor('report', 'green', '&#x2713') && true;
};

var isClientValid = function (email) {
	var clients = {'gmail.com' : true, 'yahoo.com' : true, 'hotmail.com' : true};
	var userClient = email.split('@')[1];
	return (clients[userClient]) ? true : false;
};

var changeColor  = function (id, color, sign) {
	document.getElementById(id).innerHTML = '<font color = "' + color + '">' + sign + '</font>';
};

var dateVarificationAndReport = function () {
	var day = document.getElementById("Day").value;
	var month = document.getElementById("Month").value;
	var year = document.getElementById("year").value;

	return (!isDateValid(day, month, year)) ? changeColor("dateReport", 'red', '&#x2716') : 
		changeColor("dateReport", 'green', '&#x2713');
};

var isDateValid = function (day, monthByUser, year) {
	var currentYear = new Date().getFullYear();

	if(day > 31 || day < 1 ||
		 monthByUser > 12 || monthByUser < 1 ||
		 year > currentYear || year < 1950) {
		return false;
	}

	var isValid = true;
	[2, 4, 6, 9, 11].forEach(function (month) {
		if(month == monthByUser && day > 30){
			isValid = false;
		}
	});

	if(isValid && monthByUser == 2) {
			isValid = checkLeapYear(day, year);
	}

	return isValid;
};

var checkLeapYear = function (day, year) {
	if ((year % 100 == 0 && year % 400 == 0) || (year % 100 != 0 && year % 4 == 0)){
		return day <= 29;
	}

	return day <= 28;
};

var checkAllValidations = function () {
	return areEmailsMatched() && dateValidation() && usernameLength() || false;
};