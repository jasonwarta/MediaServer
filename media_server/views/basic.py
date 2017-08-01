from flask import Flask,render_template,request,url_for,redirect,jsonify,flash,abort, send_from_directory,send_file,Response
from werkzeug import secure_filename
import os
from os import path,makedirs,rename
from uuid import uuid4

from bson import Binary, Code
from bson.json_util import dumps

from media_server import app
from media_server.lib import *

import subprocess 

@app.route('/')
def home():
	return render_template('views/home.html', title='Media')

@app.route('/admin')
def admin():
	try:
		temp_stats = subprocess.check_output(["df", "-h"], universal_newlines=True).split('\n')
		stats = []
		for s in temp_stats:
			stats.append([x for x in s.split(' ') if x != ''])
	except Exception as e:
		temp_stats = e
		pass
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

@app.route('/search/<collection>/',methods=['POST'])
@app.route('/search/<collection>/<search_string>',methods=['POST'])
def search(collection=None,search_string=None):
	if collection is not None:
		return dumps(search_db(collection=collection,search_string=search_string))
	else:
		return dumps({"Error":""})

