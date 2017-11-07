function doClick(e) {
	alert($.label.text);
}



$.searchBar.addEventListener('cancel', function(e) {
	$.searchBar.value = "";
	$.searchBar.blur();
});

$.searchBar.addEventListener('return', function(e) {

	var userInput = $.searchBar.value;

	var apiKey = '';

	var requestUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?query=' + userInput + '&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=' + apiKey;

	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			var results = JSON.parse(this.responseText);
			alert('success');
			processResults(results);
		},
		onerror: function(e) {
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

		var dataArray = _.map(results.data, function(item) {
				return {
						profile: {
							first_name: item.profile.first_name,
							middle_name: item.profile.middle_name,
							last_name: item.profile.last_name,
							title: item.profile.title,
							image_url: item.profile.image_url,
							gender: item.profile.gender,
							bio: item.profile.bio
						},
						location: {
							city: item.practices[0].visit_address.city,
							state: item.practices[0].visit_address.state,
							street: item.practices[0].visit_address.street,
							zip: item.practices[0].visit_address.zip,
							lat: item.practices.lat,
							lon: item.practices.lon,
							name: item.practices.name,
							website: item.practices.website,
						}
				};
		});

		console.log(dataArray);
	}
}

$.index.open();
