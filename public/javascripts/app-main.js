var xmlhttp;


var fileToLI = function(fileName){
	return "<li>"+fileName+"</li>";
};
var onPostDone = function(fileNamesHTML){	
	$('#result').html(fileNamesHTML);
};
var onPost = function(){
	var path = $('#path').val();
	$.ajax('/list?path='+path).done(onPostDone).error(function(err){
		$('#result').html(err.responseText);		
	});
};

var onMagic = function(){
	$.ajax('/magic.html').done(function(resultHtml){
		$('#magic').html(resultHtml);
	}).error(function(err){
		$('#result').html(err.responseText);		
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
