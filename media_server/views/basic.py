from flask import Flask,render_template,request,url_for,redirect,jsonify,flash,abort, send_from_directory,send_file,Response
from flask_login import login_required,current_user
from werkzeug import secure_filename
import os
from os import path,makedirs,rename
from uuid import uuid4

from bson import Binary, Code
from bson.json_util import dumps

from media_server import app,login_manager
from media_server.lib import *

import subprocess 

@app.route('/')
def home():
	return render_template('views/home.html', title='Media')

@app.route('/admin')
def admin():
	temp_stats = subprocess.check_output(["df", "-h"], universal_newlines=True).split('\n')
	stats = []
	for s in temp_stats:
		stats.append([x for x in s.split(' ') if x != ''])
	return render_template(
		'views/admin.html', 
		title='Admin',
		stats=stats
	)

@app.route('/rescan_dir/<folder>',methods=['POST'])
def rescan_dir(folder=None):
	if folder == 'movies':
		update_movies('media_server/movies')
		return "success"
	elif folder == 'tv':
		update_tv('media_server/tv')
		return "success"
	elif folder == 'books':
		update_books('media_server/allitebooks')
		return "success"
	return "error"

# @app.route('/books')
# def books():
# 	return render_template('views/books.html',files=get_books_list())

# @app.route('/view_book/<fname>/view')
# def view_book(fname=None):
# 	if fname is not None:
# 		return render_template(
# 			'views/view_book.html',
# 			fname=fname
# 		)

# @app.route('/download/<group>/<path:fname>')
# def download(group=None,fname=None):
# 	if group is not None and fname is not None:
# 		dirs = {
# 			'books'		: 'allitebooks/',
# 			'tv' 		: 'tv/',
# 			'movies'	: 'movies/' 
# 		}
# 		# r = requests.get(dirs[group]+fname, stream=True)
# 		# return Response(r.iter_content(chunk_size=10*1024),
# 			# content_type=r.headers['Content-Type'])
# 		return Response(open('media_server/'+dirs[group]+fname), direct_passthrough=True)
# 		# return send_file(
# 			# dirs[group]+fname,
# 			# as_attachment=True,
# 			# attachment_filename=fname
# 		# )
# 		# 

# @app.route('/stream/<path:fname>')
# def stream(fname=None):
# 	if fname is not None:
# 		request_id = str(uuid4())
# 		directory = 'media_server/streams/'+request_id
# 		if not path.exists(directory):
# 			os.makedirs(directory)
# 		if not path.exists(directory+"/segments"):
# 			os.makedirs(directory+"/segments")
# 		p = subprocess.Popen(["media_server/generate_streams.sh",request_id,'media_server/'+fname])
# 	return render_template(
# 		'views/stream.html',
# 		source="streams/"+request_id+"/stream.m3u8"
# 	)

# @app.route('/streams/<uuid>/stream.m3u8')
# def streams(uuid):
# 	return send_file('streams/'+uuid+'/stream.m3u8')

		
@app.route('/search/<category>/',methods=['POST'])
@app.route('/search/<category>/<search_string>',methods=['POST'])
def search(category=None,search_string=None):
	if category is not None:
		return dumps(search_db(category=category,search_string=search_string))
	else:
		return dumps({"Error":""})

