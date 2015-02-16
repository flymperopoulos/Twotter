// Declaration of forms used 
var $logInForm = $("#login");      				 // login user form
var $logOutForm = $('#logout');
var $addTwotte = $("#addTwotte");				 // form that adds tweet
var $listOfTwottes = $("#listOfTwottes");
var $newtwotteForm = $('.newForm');
var $newStatusForm = $('.logStatus');

// handles the error case for all .error functions in this file
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

var onSuccessLogIn = function (data, status){
	// render the fron-end form
	var resultTwotteForm = "<form id='addTwotte' action='/addTwotte' class='form-horizontal'><div class='panel-footer message' name='message' id ='authorOfTwotteWelcome'>Welcome " + data.name + "</div><textarea placeholder='Your Twoot Here' id='messageInput' class='form-control' required='true'></textarea><button type='submit' id='buttonBoom' class='btn btn-success btn-raised form-control'>Submit</button></form>";

	// render the front-end log nav bar
	var resultLogStatus = "<nav class='navbar navbar-default'><form action='/logout' id='logout' class='navbar-form navbar-right'>"+"<center>You're awesome, " + data.name + "</center><button type='submit' class='btn btn-submit btn-raised form-control'>Log Out</button></form></nav>";

	// append new form to the div for twotte submission
	$newtwotteForm.append(resultTwotteForm);

	// append new nav bar in log status section
	$('.logStatus').html(resultLogStatus);

	// call handler on new form for twootes
	$("#addTwotte").submit(postTwotteHandler);

	// call handler on new nav bar
	$('#logout').submit(logoutHandler);
}

var onSuccessLogOut = function (data, status){
	// render the front-end log nav bar
	var resultLogStatus = "<nav class='navbar navbar-default'><form action='/login' id='login' class='navbar-form navbar-right'><input type='text' id='nameField' name='username' placeholder='Enter Username' class='form-control' required='true'><button type='submit' class='btn btn-submit btn-raised form-control'>Log In</button></form></nav>";
	
	$('.logStatus').html(resultLogStatus);

	$("#addTwotte").remove();

	$('#login').submit(loginHandler);
}

var onSuccessTwotte = function (data, status){

	// cloning the top div item
	var divTwotte = $listOfTwottes.children().first().clone();
	
	// updating class and id of div
	var updatingStuff = divTwotte.attr('id', data._id).attr('class',data.author);
	// updates name
	document.getElementById('author').innerHTML = data.author;
	// updates timestamp
	document.getElementById('time').innerHTML = data.timestamp;
	// updates message
	document.getElementById('message').innerHTML = data.message;

	$listOfTwottes.prepend(updatingStuff);

	// var twoot_form = Handlebars.templates['newtwotte'];
	// $('#listOfTwottes').prepend(twoot_form(data));
	console.log(data);
}

// loginHandler function
function loginHandler(event){
	console.log('Logging in user...');
	event.preventDefault();

	var name = $("#login").find("#nameField").val();
	var urlRequest = $("#login").attr('action');

	$.post(urlRequest, {name:name})
		.done(onSuccessLogIn)
		.error(onError);
}

// logoutHandler function
function logoutHandler(event){
	console.log('Logging out user...');
	event.preventDefault();

	var urlRequest = $("#logout").attr('action');

	$.post(urlRequest,{})
		.done(onSuccessLogOut)
		.error(onError);
}

// postTwotteHandler function
function postTwotteHandler(event) {
	console.log('Submitting twotte...');
	event.preventDefault();

	var name = $logInForm.find("#nameField").val();
	var message = $("#addTwotte").find("#messageInput").val();
	var urlRequest = $("#addTwotte").attr('action');
	
	var twotteData = {
		name:name,
		message:message
	}

	$.post(urlRequest, twotteData)
		.done(onSuccessTwotte)
		.error(onError);
}

$logInForm.submit(loginHandler);
$addTwotte.submit(postTwotteHandler);
$logOutForm.submit(logoutHandler);