// Declaration of tags used via their id or class
var $addTwotte = $("#addTwotte");
var $listOfTwottes = $("#listOfTwottes");
var $trashIcon = $('.trashIcon');
var $buttonDelete = $('.img-trash-icon');

// handles the error case for all .error functions in this file
var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

// Garbage icon presence
function onClickDiv(){
	// Name of logged-in user (str)
	var sessionUser = $(this).parent().parent().children().children().first().children().attr('name');
	
	// Name of creator of twotte (str)
	var currentTwotteAuthor = $(this).children().html();
	
	// declares the jquery variable for the trash button
	$trashButton = $(this).children('img');

	// Checks if logged-in user and author match
	if (sessionUser === currentTwotteAuthor) {

		// toggles trash icon 
		$trashButton.toggle();

		// class deleteHandler to handle the removal of the twotte
		$('.img-trash-icon').click(deleteHandler);
	}
}

// delete handler called when buttonDelete is called
function deleteHandler(event){
	event.preventDefault();

	// grabs ID of twotte
	var twotteID = $(this).parent().attr('id');

	// removes twotte in frontend
	$('#'+twotteID).remove();

	// posts to update the backend of id to be deleted from database
	$.post('/deleteTwotte', {'idToDelete':twotteID})
}

// method called when twotte is succefully posted
var onSuccessTwotte = function (data, status){
	var resultTwotte;

	// rendered twotte
	resultTwotte = 	"<div class='" + data.displayName +" toggleTwotte' id=" + data._id + " name='"+data.author+ "'><span class='author'>" + data.author + "</span> @ <span class='time'><i>(" +data.timestamp+")</i></span>: <span class='message'>"+ data.message + "</span><img src='../images/trashIcon.png' width='30' height='30' class='img-trash-icon' hidden>";

	// prepended at the div with id:listOfTwottes
	$listOfTwottes.prepend(resultTwotte);

	// calls onClickDiv when event click is fired
	$('.toggleTwotte').click(onClickDiv);
}

// handler for post requests of twottes
function postTwotteHandler(event) {
	event.preventDefault();

	// declares message and urlRequest from form
	var message = $("#addTwotte").find("#messageInput").val();
	var urlRequest = $("#addTwotte").attr('action');

	// data containing the message of the form
	var twotteData = {
		message:message
	}

	// posts the data at the specified urlRequest, onSuccessTwotte called, if request passes
	$.post(urlRequest, twotteData)
		.done(onSuccessTwotte)
		.error(onError);
}

// highlight author's twottes
function selectAndHighlight(){

	// gets the author name from the list
	var authorInList = $(this).html().trim();

	// replaces space between first and last name of Facebook name with underscore
	var displayNameDiv = authorInList.replace(/ /g,"_");

	// renders the div with class clicked when toggled
	$('.'+displayNameDiv).toggleClass('clicked');
}

// submit and click events on tags and buttons
$("#addTwotte").submit(postTwotteHandler);
$('.toggleTwotte').click(onClickDiv);
$buttonDelete.submit(deleteHandler);
$('.authorName').click(selectAndHighlight);