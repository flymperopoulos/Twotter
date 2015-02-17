// Declaration of forms used 
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
	var sessionUser = $(this).parent().parent().children().children().first().children().attr('name');
	var currentTwotteAuthor = $(this).children().html();
	$trashButton = $(this).children('img');

	if (sessionUser === currentTwotteAuthor) {
		$trashButton.toggle();

		$('.img-trash-icon').click(deleteHandler);
	}
}

function deleteHandler(event){
	event.preventDefault();
	var twotteID = $(this).parent().attr('id');
	$('#'+twotteID).remove();
	$.post('/deleteTwotte', {'idToDelete':twotteID})
}

var onSuccessTwotte = function (data, status){
	var resultTwotte;
	console.log(data);

	resultTwotte = 	"<div class='" + data.author +" toggleTwotte' id=" + data._id + "><span id='author'>" + data.author + "</span> @ <span id='time'><i>(" +data.timestamp+")</i></span>: <span id='message'>"+ data.message + "</span><img src='../images/trashIcon.png' width='30' height='30' class='img-trash-icon' hidden>";

	$listOfTwottes.prepend(resultTwotte);

	$('.toggleTwotte').click(onClickDiv);
}

// handler for post requests of twottes
function postTwotteHandler(event) {
	console.log('Submitting twotte...');
	event.preventDefault();

	var message = $("#addTwotte").find("#messageInput").val();
	var urlRequest = $("#addTwotte").attr('action');
	
	console.log(urlRequest);
	debugger;
	var twotteData = {
		message:message
	}

	$.post(urlRequest, twotteData)
		.done(onSuccessTwotte)
		.error(onError);
}

// highlight author's twottes
function selectAndHighlight(){
	var authorInList = $(this).html().trim();
	var authorInTwotte = $('#author').parent().attr('name');

	if (authorInList === authorInTwotte){
		$(author).toggleClass('clicked');
	}
}

$("#addTwotte").submit(postTwotteHandler);
$('.toggleTwotte').click(onClickDiv);
$buttonDelete.submit(deleteHandler);
$('.authorName').click(selectAndHighlight);

