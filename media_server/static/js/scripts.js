window.onload = () => {
	loadContent(
		document.getElementsByClassName('selected'),
		'movies',
		'list'	
	)
};

bodyonload = () => {	

};

search = (elem) => {
	if (elem.value.length >= 3){
		loadContent(
			elem,
			document.getElementsByClassName('selected')[0].classList.item(0),
			'search'
		);
	} else {
		loadContent(
			elem,
			document.getElementsByClassName('selected')[0].classList.item(0),
			'list'
		);
	}
};

force_search = (elem) => {
	var search_box = document.getElementsByTagName('button')[0].parentElement.children[0];
	loadContent(
		search_box,
		document.getElementsByClassName('selected')[0].classList.item(0),
		'search'
	);
}

rescanFolder = (elem) => {
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		console.log(xhr.responseText);
	}
	xhr.open('POST',`rescan_dir/${elem.innerHTML.toLowerCase()}`,true);
	xhr.send(null);
}

collapseContent = (elem) => {
	var parent = elem.parentElement;
	var content = parent.children[1];
	content.innerHTML = "";
	elem.classList.remove('expanded');
}

expandVideo = (type) => {
	elem = event.target;
	var parent = elem.parentElement;
	var content = parent.children[1];

	if(elem.classList.contains('expanded') ){
		collapseContent(elem);
	} else {
        var old_elems = document.getElementsByClassName('expanded');
        for(var i = 0; i < old_elems.length; i++){
            collapseContent(old_elems[i]);
        }
        var vid = document.createElement("video");
        if (type == 'movies') {
	        vid.src = `download/movies/${elem.id}`;
        } else {
        	let season = elem.parentElement.parentElement.children[0].innerText;
        	let series = elem.parentElement.parentElement.parentElement.children[0].innerText;
        	vid.src = `download/tv/${series}/${season}/${elem.id}`;
        }
        vid.controls = "true";
		content.appendChild(vid);
        elem.classList.add('expanded');
    }
}

toggleItem = () => {
	elem = event.target;
	var parent = elem.parentElement;
	var content = parent.children;

	if (elem.classList.contains('show')){
		for(var i = 1; i < content.length; i++){
			content[i].style.display = 'none';
		}
		elem.classList.remove('show');
		elem.classList.add('hide');

	} else if (elem.classList.contains('hide')){
		for(var i = 1; i < content.length; i++){
			content[i].style.display = 'block';
		}
		elem.classList.remove('hide');
		elem.classList.add('show');
	}
}

loadContent = (elem,category,mode) => {
	// console.log(category,mode);
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if(xhr.responseText) {
			results.innerHTML = "";
			data = JSON.parse(xhr.responseText);
			if (category == 'movies') {
				for (var key in data) {
					var item = document.createElement('div');
					item.className = "item"

					header = document.createElement('div');
					header.className = 'header';
					header.id = data[key]['file'];
					header.addEventListener('click',() => {
						expandVideo('movies');
					});
					header.innerText = data[key]['name'];

					content = document.createElement('div');
					content.className = 'content';
					item.appendChild(header);
					item.appendChild(content);
					results.appendChild(item);
				}
			}
			else if (category == 'tv') {
				for (var key in data) {

					let item = document.createElement('div');
					item.className = "item";
					item.style.display = 'none';

					let item_header = document.createElement('div');
					item_header.className = 'header hide';
					item_header.id = data[key]['file'];
					item_header.addEventListener('click',() => {
						expandVideo('tv');
					});
					item_header.innerText = data[key]['name'];

					let content = document.createElement('div');
					content.className = 'content';

					item.appendChild(item_header);
					item.appendChild(content);

					let series = results.querySelector(`#${data[key]['series'].replace(/\'+/g, '').replace(/\.+/g, '-').replace(/\s+/g, '-').toLowerCase()}`);
					// console.log(series);

					if (series) {
						let season = series.querySelector(`#${data[key]['season'].replace(/\'+/g, '').replace(/\.+/g, '-').replace(/\s+/g, '-').toLowerCase()}`);
						// console.log(season);

						if (season) {
							// console.log('season already exists, adding item : '+data[key]['name'])
							season.appendChild(item);

						} else {
							// console.log('created new season : '+data[key]['season']);

							let season_header = document.createElement('div');
							season_header.className = 'header hide';
							season_header.innerText = data[key]['season'];
							season_header.addEventListener('click',() => {
								toggleItem();
							});

							let season = document.createElement('div');
							season.className = 'item';
							season.id = data[key]['season'].replace(/\'+/g, '').replace(/\.+/g, '-').replace(/\s+/g, '-').toLowerCase();
							season.style.display = 'none';

							season.appendChild(season_header);
							season.appendChild(item);

							series.appendChild(season);
						}
					} else {
						// console.log('created new series : '+ data[key]['series']);

						let series_header = document.createElement('div');
						series_header.className = 'header hide';
						series_header.innerText = data[key]['series'];
						series_header.addEventListener('click',() => {
							toggleItem();
						});

						let series = document.createElement('div');
						series.className = 'item';
						series.id = data[key]['series'].replace(/\'+/g, '').replace(/\.+/g, '-').replace(/\s+/g, '-').toLowerCase();

						series.appendChild(series_header);

						let season_header = document.createElement('div');
						season_header.className = 'header hide';
						season_header.innerText = data[key]['season'];
						season_header.addEventListener('click',() => {
							toggleItem();
						});

						let season = document.createElement('div');
						season.className = 'item';
						season.id = data[key]['season'].replace(/\'+/g, '').replace(/\.+/g, '-').replace(/\s+/g, '-').toLowerCase();
						season.style.display = 'none';

						season.appendChild(season_header);
						season.appendChild(item);

						series.appendChild(season);

						results.appendChild(series);
					}
				}
			}
			else if (category == 'books') {
				for (var key in data) {
					if (data.hasOwnProperty(key)){
						var p = document.createElement('p');
						var a = document.createElement('a');
						a.href = `download/books/${data[key]['file']}`;
						a.innerText = data[key]['name'];
						p.appendChild(a);
						results.appendChild(p);
					}
				}
			}
		}
	};
	if (mode == 'list'){
		xhr.open('POST',`search/${category}/`,true);
	}
	else if (mode == 'search'){
		xhr.open('POST',`search/${document.getElementsByClassName('selected')[0].classList.item(0)}/${elem.value}`,true);
	}
	xhr.send(null);
}

switchTab = (elem) => {
	var category;
	if (elem.classList.contains('movies')) {
		category = 'movies';
	} else if (elem.classList.contains('tv')) {
		category = 'tv';
	} else if (elem.classList.contains('books')) {
		category = 'books';
	}

	loadContent(elem,category,'list');

	document.getElementById('search').value = "";
	document.getElementsByClassName("selected")[0].classList.remove("selected");
	elem.classList.add("selected");
}