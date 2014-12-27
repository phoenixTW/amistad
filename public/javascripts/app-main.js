var xmlhttp;

var onPostDone = function(fileNamesHTML){
	$('#comments').html(fileNamesHTML);
};

var onPost = function(){
	var msg = $('#msg').val();
	$('#msg').val('');	
	$.post('/postForm', {msg: msg}).done(onPostDone).error(function(err){
		$('#comments').html(err.responseText);		
	});
};

var setHTTPRequest = function () {
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
}

var onPageLoad = function(){
	$('#post').click(onPost);
}
$(document).ready(onPageLoad);


// var xmlhttp;
// if (window.XMLHttpRequest)
//   {// code for IE7+, Firefox, Chrome, Opera, Safari
//   xmlhttp=new XMLHttpRequest();
//   }
// else
//   {// code for IE6, IE5
//   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//   }
// xmlhttp.onreadystatechange=function()
//   {
//   if (xmlhttp.readyState==4 && xmlhttp.status==200)
//     {
//     document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
//     }
//   }
// xmlhttp.open("POST","demo_post2.asp",true);
// xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
// xmlhttp.send("fname=Henry&lname=Ford");
