from flask import Flask,render_template,request,url_for,redirect,jsonify,flash,abort, send_from_directory,send_file
from flask_login import login_required,current_user
from werkzeug import secure_filename
from os import path,makedirs,rename
from uuid import uuid4

from bson import Binary, Code
from bson.json_util import dumps

from media_server import app,login_manager
from media_server.lib import *

@app.route('/')
def home():
	return render_template('views/home.html')

@app.route('/admin')
def admin():
	return render_template('views/admin.html')

@app.route('/rescan_dir/<folder>',methods=['POST'])
def rescan_dir(folder=None):
	if folder == 'movies':
		update_movies('/Users/jasonwarta/projects/MediaServer/media_server/movies')
		return "success"
	elif folder == 'tv':
		update_tv('/Users/jasonwarta/projects/MediaServer/media_server/tv')
		return "success"
	elif folder == 'books':
		update_books('/Users/jasonwarta/projects/MediaServer/media_server/allitebooks')
		return "success"
	return "error"

@app.route('/books')
def books():
	return render_template('views/books.html',files=get_books_list())

@app.route('/view_book/<fname>/view')
def view_book(fname=None):
	if fname is not None:
		return render_template(
			'views/view_book.html',
			fname=fname
		)

@app.route('/download/<group>/<<path:></path:>fname>')
def download(group=None,fname=None):
	if group is not None and fname is not None:
		dirs = {
			'books'		: 'allitebooks/',
			'tv' 		: 'tv/',
			'movies'	: 'movies/' 
		}
		return send_file(
			dirs[group]+fname,
			as_attachment=True,
			attachment_filename=fname
		)
		
@app.route('/search')
@app.route('/search/<category>',methods=['GET','POST'])
@app.route('/search/<category>/<search_string>',methods=['GET','POST'])
def search(category=None,search_string=None):
	if category is not None:
		return dumps(search_db(category=category,search_string=search_string))
	else:
		return render_template('views/results.html')

@app.route('/list_files&opt=<opt>',methods=['GET','POST'])
def list_files(opt=None):
	return None;