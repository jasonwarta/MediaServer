var State = {
	SPLASH   : 0,
	GET_FILE : 1,
	SEARCH   : 2,

}

const WIDTH = 700;
const HEIGHT = 500;

const BTN_HEIGHT = 20;
const BTN_WIDTH = 60;
const BTN_MARGIN = 5;


// https://api.themoviedb.org/3/search/movie?api_key=3961335a9828f92383fbd0ec65f09c03&language=en-US&query=Fight%20Club&page=1&include_adult=false&region=US&year=1999&primary_release_year=1999
// tmdb movie search fields: 
// api_key 				required
// language
// query  				required
// page
// include_adult
// region
// year
// primary_release_year
// 
// https://api.themoviedb.org/3/search/tv?api_key=3961335a9828f92383fbd0ec65f09c03&language=en-US&query=Game%20of%20Thrones&page=1&first_air_date_year=2009
// tmdb tv search fields
// api_key 				required
// language
// query  				required
// page
// first_air_date_year


class FileTagger {
	constructor (elem) {
		this.elem = elem;
		elem.style = `border:1px solid black;
					  width:${ WIDTH }px;
					  height:${ HEIGHT }px;`;
		this.state = State.SPLASH;
		this.draw();
	}

	make_state_btn (num,text) {
		let btn = mkelem('button');
		btn.innerText = `${text}`;
		btn.addEventListener('click', (event) => {
			this.update_state(num);
		});
		btn.style = `height:${ BTN_HEIGHT }px;
					 width:${ BTN_WIDTH }px; 
					 top:${ HEIGHT - (BTN_HEIGHT + BTN_MARGIN) }px;
					 left:${ (num * BTN_WIDTH) + ((num+1) * BTN_MARGIN) }px;
					 position:absolute;`;
		return btn;
	}

	update_state (new_state) {
		this.state = new_state;
		this.draw();
		console.log(this.state);
	}

	query_movie () {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				console.log(xhr.responseText);
			}
		}
		xhr.open('POST', "get-movie-details/search?language=en-US&query=Fight%20Club&page=1&include_adult=false&region=US&year=1999&primary_release_year=1999", true)
		xhr.send(null);

		
		// language
		// query  				required
		// page
		// include_adult
		// region
		// year
		// primary_release_year
		
	}

	search_movies () {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				this.search_results = JSON.parse(xhr.responseText);
				this.update_state(State.SEARCH);
				this.draw();
			}
		}
		xhr.open('POST',`search/movies/${document.getElementById('fname').value}`,true);
		xhr.send(null);
	}

	draw () {
		this.elem.innerHTML = "";
		if (this.state == State.SPLASH) {
			let p = mkelem('p');
			p.innerText = "Hello World";
			p.addEventListener( 'click', (event) => {
				alert(this.state);
			});
			this.elem.appendChild(p);
		}
		else if (this.state == State.GET_FILE) {
			let label = mkelem('label');
			label.innerText = "Find Movie";
			let fname = mkelem('input');
			fname.id = "fname";
			let submit = mkelem('button');
			submit.addEventListener('click', (event) => {
				this.search_movies();
			});
			submit.innerText = "Search";
			label.appendChild(fname);
			this.elem.appendChild(label);
			this.elem.appendChild(submit);
		}
		else if (this.state == State.SEARCH) {
			let ul = mkelem('ul');
			ul.style = "padding-left:10px; list-style:none;";
			this.search_results.forEach( (entry,key) => {
				entry = JSON.parse(entry);
				let li = mkelem('li');
				li.id = `${key}`;
				li.innerText = entry["name"];
				li.addEventListener('click', (event) => {
					alert( JSON.parse(this.search_results[event.target.id])['_id'] );
					this.query_movie();
				});
				ul.appendChild(li);
			});
			// let p = mkelem('p');
			// p.innerText = JSON.parse(this.search_results);
			// this.elem.appendChild(p);
			this.elem.appendChild(ul);
		}

		this.elem.appendChild( this.make_state_btn(State.SPLASH, "Splash") );
		this.elem.appendChild( this.make_state_btn(State.GET_FILE, "Get File") );
		this.elem.appendChild( this.make_state_btn(State.SEARCH, "Search") );
	}
}

