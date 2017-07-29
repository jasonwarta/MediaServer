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

expand_video = (type) => {
	let elem = event.target;
	let content = elem.parentElement.children[1];

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
        	let content = event.target.parentElement;
        	console.log()
        	content.innerHTML = "";
        	p = document.createElement('p');
        	p.className = "error";
        	p.innerText = `Sorry, "${content.parentElement.children[0].innerText}" was not found.`;
        	content.appendChild(p);
        });

        if (type == 'movies') {
	        vid.src = `movies/${elem.id}`;
        } else {
        	let season = elem.parentElement.parentElement.children[0].innerText;
        	let series = elem.parentElement.parentElement.parentElement.children[0].innerText;
        	vid.src = `tv/${series}/${season}/${elem.id}`;
        }
		content.appendChild(vid);
        elem.classList.add('expanded');
    }
}

toggle_item = () => {
	let elem = event.target;
	// let content = elem.parentElement.children;
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

load_content = (category,mode) => {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE) {
			results.innerHTML = "";
			try {
				var data = JSON.parse(xhr.responseText);
			} catch(e) {
				console.log("Error", e.stack);
			    console.log("Error", e.name);
			    console.log("Error", e.message);
			}
			if (category == 'movies') {
				data.forEach( (entry) => {
					let item = document.createElement('div');
					item.className = "item"

					header = document.createElement('div');
					header.className = 'header';
					header.id = entry['file'];
					header.addEventListener('click',() => {
						expand_video('movies');
					});
					header.innerText = entry['name'];

					content = document.createElement('div');
					content.className = 'content';
					item.appendChild(header);
					item.appendChild(content);
					results.appendChild(item);
				});
			}
			else if (category == 'tv') {
				for (let key in data) {

					let item = document.createElement('div');
					item.className = "item";
					item.style.display = 'none';

					let item_header = document.createElement('div');
					item_header.className = 'header hide';
					item_header.id = data[key]['file'];
					item_header.addEventListener('click',() => {
						expand_video('tv');
					});
					item_header.innerText = data[key]['name'];

					let content = document.createElement('div');
					content.className = 'content';

					item.appendChild(item_header);
					item.appendChild(content);

					let series = results.querySelector(`#${data[key]['series'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase()}`);

					if (series) {
						let season = series.querySelector(`#${data[key]['season'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase()}`);

						if (season) {
							season.appendChild(item);

						} else {
							let season_header = document.createElement('div');
							season_header.className = 'header hide';
							season_header.innerText = data[key]['season'];
							season_header.addEventListener('click',() => {
								toggle_item();
							});

							let season = document.createElement('div');
							season.className = 'item';
							season.id = data[key]['season'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase();

							season.style.display = 'none';

							season.appendChild(season_header);
							season.appendChild(item);

							series.appendChild(season);
						}
					} else {
						let series_header = document.createElement('div');
						series_header.className = 'header hide';
						series_header.innerText = data[key]['series'];
						series_header.addEventListener('click',() => {
							toggle_item();
						});

						let series = document.createElement('div');
						series.className = 'item';
						series.id = data[key]['series'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase();


						series.appendChild(series_header);

						let season_header = document.createElement('div');
						season_header.className = 'header hide';
						season_header.innerText = data[key]['season'];
						season_header.addEventListener('click',() => {
							toggle_item();
						});

						let season = document.createElement('div');
						season.className = 'item';
						season.id = data[key]['season'].replace(/^/g, 'm').replace(/[\',]/g, '').replace(/[\.\s]/g, '-').toLowerCase();

						season.style.display = 'none';

						season.appendChild(season_header);
						season.appendChild(item);

						series.appendChild(season);

						results.appendChild(series);
					}
				}
			}
			else if (category == 'books') {
				for (let key in data) {
					if (data.hasOwnProperty(key)){
						let p = document.createElement('p');
						let a = document.createElement('a');
						a.href = `books/${data[key]['file']}`;
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