(function() {
	var anchors = document.getElementsByTagName('a'); //Find all links
	var historyState = {};
	//We will use the current "folder" as the base, so all new locations are relative to that
	var base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
	
	//Go through all the links and change the relevant ones
	for (var i = 0; i < anchors.length; i++) {
		//Only apply this to same domain links
		if (anchors[i].href.substring(0, location.origin.length) !== location.origin) {
			continue;
		}
		
		anchors[i].addEventListener('click', function(evt) {
			//When clicked, we do not want the link to be processed normally
			evt.preventDefault();
			
			//Change to new page with hash
			var newPage = window.location.href + '#' + evt.target.href.replace(base, '');
			window.location.href = newPage;
			
			//Only do this if history.pushState is supported by the browser
			if (history && history.pushState) {
				//Remove hash from URL and replace with desired URL
				history.pushState(historyState, evt.target.innerHTML, evt.target.href)
			}
		});
	}
})();
