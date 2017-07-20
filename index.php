<html>

<head>
<script>
function collapseContent(elem){
	var parent = elem.parentElement;
	var content = parent.children[1];
	content.innerHTML = "";
	elem.classList.remove('expanded');
}

function expandVideo(elem){
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
        vid.src = elem.id;
        vid.controls = "true";
		content.appendChild(vid);
        elem.classList.add('expanded');
    }
}

function toggleItem(elem){
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

function switchTab(elem){
	if (elem.classList.contains("movies") ){
		document.getElementById("movies").style.display = "block";
		document.getElementById("tv").style.display = "none";
	}
	else if (elem.classList.contains("tv") ){
		document.getElementById("movies").style.display = "none";
		document.getElementById("tv").style.display = "block";

	}
	document.getElementsByClassName("selected")[0].classList.remove("selected");
	elem.classList.add("selected");
}
</script>

<style>
	body {
		padding:0;
		margin:0;
		background:#dcdcdc;
	}
	.body {
		margin-top:110px;
	}
	.tabs {
		position:fixed;
		top:0;
		left:0;
		background:#acacac;
		width:100%;
		margin:0;
		box-shadow: -4px 4px 4px -4px rgba(0,0,0,0.7);
	}
	.item {
		border-radius:15px;
		border: 0.5px solid rgba(0,0,0,0.3);
		margin-bottom:10px;
		background:#dcdcdc;
		margin-left:10px;
		margin-right:10px;
		box-shadow:  -4px 4px 4px -4px rgba(0,0,0,0.7);
	}
	.header {
		border-top-left-radius:15px;
		border-top-right-radius:15px;
		padding:30px;
		padding-left:100px;
		font-size:2em;
	}
	img {
		border-bottom-left-radius:13px;
		border-bottom-right-radius:13px;
		width:100%;
	}
	ul {
		padding:30px;
		margin-bottom:10px;
	}
	li {
		display:inline;
		padding:30px;
		margin-right:10px;
		font-size:2em;
	}
	li.selected {
		background:#dcdcdc;
		box-shadow: inset -7px 7px 9px -7px rgba(0,0,0,0.6);
	}
	img.temp {
		border-radius:13px;
	}
	video {
		width:100%;
		border-bottom-left-radius:13px;
		border-bottom-right-radius:13px;
	}
</style>

</head>

<body>

<ul class='tabs'>
	<li class="movies selected" onclick="switchTab(this);">Movies</li>
	<li class="tv" onclick="switchTab(this);">TV</li>
</ul>

<div class='body'>

<div id='movies' style='display:block;'>
<?php
$dir = '../drive/movies/';
$files = scandir($dir,$sorting_order = SCANDIR_SORT_ASCENDING);

foreach($files as $filename) {
        if($filename != ".." && $filename != "." && substr($filename,0,2) != "._") {
	    	$link = "<div class='item'>
	            	<div class='header' id='/movies/$filename' onclick='expandVideo(this);'>$filename</div>
	            	<div class='content'></div>
	            	</div>";
	    	echo $link;
	}
}
?>
</div>

<div id='tv' style='display:none;'>
<?php 

$dir = '../drive/tv/';
$folders = scandir($dir,$sorting_order = SCANDIR_SORT_ASCENDING);

$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));

$files = array();

foreach($rii as $file) {
	if ($file->isDir()){
		continue;
	}

	$files[] = $file->getPathname();
}
sort($files);

$show_name     = "";
$season_number = "";
$episode_name  = "";

foreach ($files as $value) {
	if($show_name != preg_split("/[\/]+/",$value)[3]) {
		echo "</div></div>";
		$show_name = preg_split("/[\/]+/",$value)[3];
		$season_number = preg_split("/[\/]+/",$value)[4];

		$show_info = "<div class='item'>
			<div class='header hide' onclick='toggleItem(this);'>$show_name</div>";
		echo $show_info;

		$season_name = "<div class='item' style='display:none;'>
			<div class='header hide' onclick='toggleItem(this);'>$season_number</div>";
		echo $season_name;
	} else if ($season_number != preg_split("/[\/]+/",$value)[4]) {
		echo "</div>";
		$season_number = preg_split("/[\/]+/",$value)[4];
		$season_name = "<div class='item' style='display:none;'>
			<div class='header hide' onclick='toggleItem(this);'>$season_number</div>";
		echo $season_name;
	}
	$episode_name = preg_split("/[\/]+/",$value)[5];
	if(substr($episode_name,0,2) != "._"){
		$episode_item = "<div class='item' style='display:none;'>
			<div class='header' id='/tv/$show_name/$season_number/$episode_name' onclick='expandVideo(this);'>$episode_name</div>
			<div class='tv content'></div>
		</div>";
		echo $episode_item;
	}
}
?>
</div>

</div>

</body>

</html>
