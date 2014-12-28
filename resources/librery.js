exports.comparePassword = function (password1, password2, error) {
	return (password1 == password2 && !error) 
		? true 
		: false;
};