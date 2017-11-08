

// When user hit cancel button, clear form and close input form
$.searchBar.addEventListener('cancel', function(e) {
	$.searchBar.value = "";
	$.searchBar.blur();
});


// When user typed and hit return, run this method
$.searchBar.addEventListener('return', function(e) {

	var userInput = $.searchBar.value;

	var apiKey = '';

	var requestUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?query=' + userInput + '&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=' + apiKey;

	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			//SUCCESS
			var results = JSON.parse(this.responseText);
			alert('success');
			processResults(results);
		},

		onerror: function(e) {
			//ERROR
			Ti.API.debug(e.error);
			alert('error');
		},
		timeout:5000
	});

	xhr.open("GET", requestUrl);
	xhr.send();

	// clear input form and close
	$.searchBar.value = "";
	$.searchBar.blur();
});



function processResults(results) {
	if (results) {

		var sections = [];

		// populate data object and store them to dataArray
		var dataArray = _.map(results.data, function(item) {
				return [{
						template: "userTemplate",
						fullName: {text: item.profile.first_name + ' ' + item.profile.middle_name + ' ' + item.profile.last_name + ', ' + item.profile.title},
						imageUrl: {image: item.profile.image_url},
						gender: {text: item.profile.gender},
						bio: {text: item.profile.bio},
						city: {text: item.practices[0].visit_address.city},
						state: {text: item.practices[0].visit_address.state},
						street: {text: item.practices[0].visit_address.street},
						zip: {text: item.practices[0].visit_address.zip},
						lat: {text: item.practices.lat},
						lon: {text: item.practices.lon},
						name: {text: item.practices.name},
						website: {text: item.practices.website}

				}];
		});

		//if result was 0, exit
		if (dataArray.length < 1) return;


		// iterate array and create displaylist,
		_.each(dataArray, function(data) {
			var sectionHeader = Ti.UI.createView({
				backgroundColor: "#ececec",
				width: Ti.UI.FILL, //fill the parent in this dimention
				height: 30
			});

			var sectionLabel = Ti.UI.createLabel({
			 text: data.fullName,
			 left: 20,
			 font:{
				 fontSize: 20
			 },
			 color: "#666"
			});
			sectionHeader.add(sectionLabel);

			var section = Ti.UI.createListSection({
			 headerView: sectionHeader
		 });

		 section.items = data;

		 //push to the sections array
		 sections.push(section);
		});

		// display to id="listView"
		$.listView.sections = sections;
	}
}


// initialize
$.win1.open();
