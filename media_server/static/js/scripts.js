window.onload = () => {
	if (document.getElementById('results')){
		load_content(
			'movies',
			'list'	
		)
	}
};

bodyonload = () => {	

};

search = () => {
	let search = document.getElementById('search');

	if (search.value.length >= 3){
		// reduce unneceesary queries with large quantities of results
		load_content(
			document.getElementsByClassName('selected')[0].classList.item(0),
			'search'
		);
	} else {
		load_content(
			document.getElementsByClassName('selected')[0].classList.item(0),
			'list'
		);
	}
};

force_search = () => {
	// this is only called when the search button is pressed
	load_content(
		document.getElementsByClassName('selected')[0].classList.item(0),
		'search'
	);
}

rescan_folder = (elem) => {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		console.log(xhr.responseText);
	}
	xhr.open('POST',`rescan_dir/${elem.innerHTML.toLowerCase()}`,true);
	xhr.send(null);
}

collapse_content = (elem) => {
	let content = elem.parentElement.children[1];
	content.innerHTML = "";
	elem.classList.remove('expanded');
}

expand_video = (event) => {
	let elem = event.target||event.srcElement;
	let content = elem.parentElement.children[1];
	let type = document.getElementsByClassName('selected')[0].classList[0];

	if(elem.classList.contains('expanded') ){
		collapse_content(elem);
	} else {
        let old_elems = document.getElementsByClassName('expanded');
        for(let i = 0; i < old_elems.length; i++){
            collapse_content(old_elems[i]);
        }
        let vid = document.createElement("video");
        vid.controls = "true";
        vid.addEventListener('error', () => {
        	let content = event.target.parentElement.children[1];
        	content.innerHTML = "";
        	p = document.createElement('p');
        	p.className = "error";
        	p.innerText = `Sorry, "${content.parentElement.children[0].innerText}" was not found.`;
        	content.appendChild(p);
        });

        if (type == 'movies') {
	        vid.src = `movies/${elem.id}`;
	        // vid.poster = `http://image.tmdb.org/t/p/w185//hZVcmztCVo510FhBXyLqStiTAce.jpg`;
        } else {
        	let season = elem.parentElement.parentElement.children[0].innerText;
        	let series = elem.parentElement.parentElement.parentElement.children[0].innerText;
        	vid.src = `tv/${series}/${season}/${elem.id}`;
        }
		content.appendChild(vid);
        elem.classList.add('expanded');
    }
}

toggle_item = (event) => {
	let elem = event.target||event.srcElement;
	let content = Array.from(elem.parentElement.children);

	if (elem.classList.contains('show')){
		content.forEach( (entry,index) => {
			if(index >= 1){
				entry.style.display = 'none';
			}
		});
		elem.classList.remove('show');
		elem.classList.add('hide');

	} else if (elem.classList.contains('hide')){
		content.forEach( (entry,index) => {
			if(index >= 1){
				entry.style.display = 'block';
			}
		});
		elem.classList.remove('hide');
		elem.classList.add('show');
	}
}

build_item = (entry,tv) => {
	let item = document.createElement('div');
	item.className = "item";
	if (tv) item.style.display = 'none';

	let header = document.createElement('div');
	header.className = 'header hide';
	header.id = entry['file'];
	header.innerText = entry['name'];
	header.addEventListener('click', event => {
		expand_video(event);
	});

	let content = document.createElement('div');
	content.className = 'content';

	item.appendChild(header);
	item.appendChild(content);

	return item;
}

build_season = (entry) => {
	let season_header = document.createElement('div');
	season_header.className = 'header hide';
	season_header.innerText = entry['season'];
	season_header.addEventListener('click',(event) => {
		toggle_item(event);
	});

	let season = document.createElement('div');
	season.className = 'item';
	season.id = entry['season'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase();

	season.style.display = 'none';

	season.appendChild(season_header);

	return season;
}

build_series = entry => {
	let series_header = document.createElement('div');
	series_header.className = 'header hide';
	series_header.innerText = entry['series'];
	series_header.addEventListener('click',(event) => {
		toggle_item(event);
	});

	let series = document.createElement('div');
	series.className = 'item';
	series.id = entry['series'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase();

	series.appendChild(series_header);

	return series;
}

load_content = (category,mode) => {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE) {
			results.innerHTML = "";
			data = xhr.responseText;
			try {
				var data = JSON.parse(xhr.responseText);
			} catch(e) {
				console.log("Error", e.stack);
			    console.log("Error", e.name);
			    console.log("Error", e.message);
			}
			if (category == 'movies') {
				data.forEach( (entry) => {
					entry = JSON.parse(entry);

					let item = build_item(entry,false);
					
					results.appendChild(item);
				});
			}
			else if (category == 'tv') {
				data.forEach( (entry) => {
					entry = JSON.parse(entry);				

					let item = build_item(entry, true);

					let series = results.querySelector(`#${entry['series'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase()}`);

					if (series) {
						let season = series.querySelector(`#${entry['season'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase()}`);

						if (season) {
							season.appendChild(item);

						} else {
							let season = build_season(entry);

							season.appendChild(item);

							series.appendChild(season);
						}
					} else {
						let series = build_series(entry);
						let season = build_season(entry);
						
						season.appendChild(item);

						series.appendChild(season);

						results.appendChild(series);
					}
				});
			}
			else if (category == 'books') {
				data.forEach( (entry) => {
					entry = JSON.parse(entry);

					let p = document.createElement('p');
					let a = document.createElement('a');
					a.href = `books/${entry['file']}`;
					a.innerText = entry['name'];
					p.appendChild(a);
					results.appendChild(p);
				});
			}
		}
	};
	if (mode == 'list'){
		xhr.open('POST',`search/${category}/`,true);
	}
	else if (mode == 'search'){
		xhr.open('POST',`search/${document.getElementsByClassName('selected')[0].classList.item(0)}/${document.getElementById('search').value}`,true);
	}
	xhr.send(null);
}

switch_tab = (elem) => {
	let category;
	if (elem.classList.contains('movies')) {
		category = 'movies';
	} else if (elem.classList.contains('tv')) {
		category = 'tv';
	} else if (elem.classList.contains('books')) {
		category = 'books';
	}

	load_content(category,'list');

	document.getElementById('search').value = "";

	document.getElementsByClassName("selected")[0].classList.remove("selected");
	elem.classList.add("selected");
}