$(document).ready(function(){
	$("#home").on('mouseenter', function(){
			$(this).html("Home");
	}).on('mouseleave', function(){
		$(this).html('<i class="fa fa-home"></i>');
	});

	$("#about").on('mouseenter', function(){
		$(this).html("About");
	}).on('mouseleave',function(){
		$(this).html('<i class="fa fa-address-card"></i>');
	});

	$("#contact").on('mouseenter', function(){
		$(this).html("Contact");
	}).on('mouseleave', function(){
		$(this).html('<i class="fa fa-address-book"></i>');
	});

	
});