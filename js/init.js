//Prevent JQM to mess upp the UI. Firefox only
$(document).bind('mobileinit', function () {
	if (navigator.userAgent.match(/(Firefox)/)) {
        $.mobile.autoInitializePage = false;
    } 
});