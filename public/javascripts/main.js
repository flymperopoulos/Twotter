// Declaration of forms used 
var $logInForm = $("#login");      				 // login user form
var $logOutForm = $('#logout');
var $addTwotte = $("#addTwotte");				 // form that adds tweet
var $listOfTwottes = $("#listOfTwottes");
var $newtwotteForm = $('.newForm');
var $newStatusForm = $('.logStatus');
var $trashIcon = $('.trashIcon');
var $buttonDelete = $('.img-trash-icon');
var $authorSelect = $('.authorName');

// handles the error case for all .error functions in this file
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

function onClickDiv(){
	var sessionUser = $(this).parent().parent().children().children().first().children().attr('name');
	var currentTwotteAuthor = $(this).children().html();
	$trashButton = $(this).children('img');

	console.log(currentTwotteAuthor);
	console.log(sessionUser);

	if (sessionUser === currentTwotteAuthor) {
		$trashButton.toggle();
		$('.img-trash-icon').click(deleteHandler);
	}
}

var onSuccessLogIn = function (data, status){

	console.log('data when login', data);
	var flag = false;

	// render the fron-end form
	var resultTwotteForm = "<form id='addTwotte' action='/addTwotte' class='form-horizontal'><div class='panel-footer message' name='message' id ='authorOfTwotteWelcome'>Welcome, " + data.name + "!</div><textarea placeholder='Your Twoot Here' id='messageInput' class='form-control' required='true'></textarea><button type='submit' id='buttonBoom' class='btn btn-success btn-raised form-control'>Submit</button></form>";

	// render the front-end log nav bar
	var resultLogStatus = "<nav class='navbar navbar-default'><form action='/logout' name="+data.name + " id='logout' class='navbar-form navbar-right'>You're logged in as, " + data.name + "<button type='submit' class='btn btn-submit btn-raised form-control'>Log Out</button></form></nav>";

	// append new form to the div for twotte submission
	$newtwotteForm.append(resultTwotteForm);

	// append new nav bar in log status section
	$('.logStatus').html(resultLogStatus);

	// call handler on new form for twootes
	$("#addTwotte").submit(postTwotteHandler);

	// call handler on new nav bar
	$('#logout').submit(logoutHandler);

	$.each($(".authorName"), function(index, value){
	  		if (value.innerText === data.name){
	  			flag = true;
	  		}
		});
	      	if(!flag){
	      		$(".authorsList").prepend('<div class="'+data.name+ ' authorName" id="'+data._id+ '">'+data.name+'</div>');
	}
	$('.authorName').unbind();
	$('.authorName').click(selectAndHighlight);

}

var onSuccessLogOut = function (data, status){
	// render the front-end log nav bar
	var resultLogStatus = "<nav class='navbar navbar-default'><form action='/login' id='login' class='navbar-form navbar-right'><input type='text' id='nameField' name='username' placeholder='Enter Username' class='form-control' required='true'><button type='submit' class='btn btn-submit btn-raised form-control'>Log In</button></form></nav>";
	
	$('.logStatus').html(resultLogStatus);

	$("#addTwotte").remove();

	$('#login').submit(loginHandler);
}

var onSuccessTwotte = function (data, status){
	var resultTwotte;
	console.log(data);

	resultTwotte = 	"<div class='" + data.author +" toggleTwotte' id=" + data._id + "><span id='author'>" + data.author + "</span> @ <span id='time'>" + data.timestamp + "</span>: <span id='message'>"+ data.message + "</span><img src='../images/trashIcon.png' width='30' height='30' class='img-trash-icon' hidden>";

	$listOfTwottes.prepend(resultTwotte);

	$('.toggleTwotte').click(onClickDiv);

	// var twoot_form = Handlebars.templates['newtwotte'];
	// $('#listOfTwottes').prepend(twoot_form(data));
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

	var message = $("#addTwotte").find("#messageInput").val();
	var urlRequest = $("#addTwotte").attr('action');
	
	var twotteData = {
		message:message
	}

	$.post(urlRequest, twotteData)
		.done(onSuccessTwotte)
		.error(onError);
}

function deleteHandler(event){
	event.preventDefault();
	var twotteID = $(this).parent().attr('id');

	$('#'+twotteID).remove();
	$.post('/deleteTwotte', {'idToDelete':twotteID})
}

function selectAndHighlight(){
	var author = $(this).html().trim();
	$('.'+author).toggleClass('clicked');
}

$logInForm.submit(loginHandler);
$("#addTwotte").submit(postTwotteHandler);
$logOutForm.submit(logoutHandler);
$('.toggleTwotte').click(onClickDiv);
$buttonDelete.submit(deleteHandler);
$('.authorName').click(selectAndHighlight);