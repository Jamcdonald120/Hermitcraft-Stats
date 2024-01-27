var total;
$(document).ready(function () {
	const params = new URLSearchParams(window.location.search);
	const statParam = params.get('stat');
	const statName=params.get('stat');
	const jsonUrl = statName+'.json'; // The path to your JSON file.

	$('h1').append(statName)
	$('title').append(": "+statName)
	function calculateTotal(data) {
		data.sort((a, b) => b.number - a.number);
		let total = 0;
			data.forEach((item, index)=> {
			total += item.amount;
			item.rank=index+1

		});
		if (total===0){
			total=1;
		}
		return total;
	}
	// Function to populate the list from JSON data.
	function populateList(data) {
		const listContainer = $('#listContainer');
		listContainer.empty();
		listContainer.append(`<li class="list-item header"><span class='rank'>Rank</span><span class='name'>Username</span><span class='number'>Raw Stat</span><span class='percentage'>% of Total</span><div class='progress-bar header'> Distribution</div></li>`)
		// Sort the data based on the 'number' field (largest to smallest).
		data.sort((a, b) => b.number - a.number);

		// Iterate through the sorted data and create list items.
		
		data.forEach((item, index) => {
			const listItem = $('<li>', { class: 'list-item' });
			listItem.append(`<span class='rank'>${item.rank}:</span>`); 
			listItem.append(`<span class='name'>${item.name}</span>`);
			listItem.append(`<span class='number'>${item.amount}</span>`);
			listItem.append(`<span class='percentage'>${Math.round(item.amount*100/total)}%</span>`);
		
			// Create a colored background "bar" based on the percentage of total.
			const progressBar = $('<div>', { class: 'progress-bar' });
			const progressBarFill = $('<div>', { class: 'progress-bar-fill' });
			const percentage = (item.amount / total) * 100;
			progressBarFill.css('width', `${percentage}%`);
			progressBar.append(progressBarFill);
			listItem.append(progressBar);
			//listItem.append(progressBarFill);
			listContainer.append(listItem);
			
		});
		
	}

	// Function to filter the list based on the search input.
	function filterList(searchValue) {
		const data = jsonData.filter(item => item.name.	toLowerCase().includes(searchValue.toLowerCase()));
		populateList(data);
	}

	// Fetch JSON data from the server and populate the list.
	$.getJSON(jsonUrl, function (data) {
		// Store the original data to reset the list on search.
		window.jsonData = data;
		total = calculateTotal(data);
		const totalElement = $('#total');
		totalElement.text(`Total: ${total}`);
		//$('#listContainer').after(totalElement);
		populateList(data);
	}).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("getJSON request failed: " + err);
});

	// Listen for changes in the search input.
	$('#searchInput').on('input', function () {
		filterList($(this).val());
	});

});

// Function to get the value of a cookie
function getCookie(cookieName) {
	const cookies = document.cookie.split('; ');
	for (const cookie of cookies) {
		const [name, value] = cookie.split('=');
		if (name === cookieName) {
			return value;
		}
	}
	return null;
}

function setCookie(cookieName, value) {
	document.cookie = `${cookieName}=${value}`;
	
}

const initialDarkCookie=localStorage.getItem('darkmode')
if(initialDarkCookie=='sane'){
		activateLightMode();
		document.getElementById('saneMode').checked=true;
	}else if(initialDarkCookie=='dark'){
		activateDarkMode();
		document.getElementById('darkMode').checked=true;
	}else if(initialDarkCookie=='amoled'){
		activateAmoledMode();
		document.getElementById('amoledMode').checked=true;
	}
function activateLightMode(){
	const rootElement = document.documentElement;
	rootElement.removeAttribute('class');
	localStorage.setItem('darkmode','sane');
}

function activateDarkMode(){
	const rootElement = document.documentElement;
	rootElement.removeAttribute('class');
	rootElement.classList.add('darkmode');
	localStorage.setItem('darkmode','dark')
}

function activateAmoledMode(){
		const rootElement = document.documentElement;
	rootElement.removeAttribute('class');
	rootElement.classList.add('amoledmode');
	localStorage.setItem('darkmode','amoled')
}
