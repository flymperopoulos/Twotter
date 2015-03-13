(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['navigationheader'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<nav class=\"navbar navbar-default\">\n	<form action='/login' id='login' class='navbar-form navbar-right'>\n			<input type='text' id=\"nameField\" name='username' placeholder='Enter Username' class='form-control' required='true'>\n			<button type='submit' class='btn btn-submit btn-raised form-control'>Log In</button>\n	</form>\n</nav>";
},"useData":true});
templates['newtwotte'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "\n	<div class=\""
    + alias2(alias1((depth0 != null ? depth0.author : depth0), depth0))
    + "\" id=\""
    + alias2(alias1((depth0 != null ? depth0._id : depth0), depth0))
    + "\">\n\n		"
    + alias2(alias1((depth0 != null ? depth0.author : depth0), depth0))
    + " @ "
    + alias2(alias1((depth0 != null ? depth0.timestamp : depth0), depth0))
    + "<br>\n		Message: "
    + alias2(alias1((depth0 != null ? depth0.message : depth0), depth0))
    + "\n		\n	</div>\n\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"listOfTwottes\">\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.twottes : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>";
},"useData":true});
templates['twottesubmit'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<form id='addTwotte' action='/addTwotte' class='form-horizontal'>\n\n	<div class='panel-footer message' name='message' id =\"authorOfTwotteWelcome\">Welcome, "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "!\n	</div>\n	<textarea placeholder='Your Twoot Here' id=\"messageInput\" class='form-control' required='true'></textarea>\n	<button type='submit' id=\"buttonBoom\" class='btn btn-success btn-raised form-control'>Submit</button>\n\n</form>";
},"useData":true});
templates['welcometitlewithlogo'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"heading-title-banner\" id=\"welcomeTitle\">\n 	Twotter, the place to be!\n	<img src=\"../images/twotterLogo.png\" height=\"100\" width=\"100\">\n</div>";
},"useData":true});
})();
