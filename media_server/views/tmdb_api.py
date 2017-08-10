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

# https://api.themoviedb.org/3/search/movie?api_key=3961335a9828f92383fbd0ec65f09c03&language=en-US&query=Fight%20Club&page=1&include_adult=false&region=US&year=1999&primary_release_year=1999

API_KEY = "3961335a9828f92383fbd0ec65f09c03"
# get-movie-details/search?language=en-US&query=Fight%20Club&page=1&include_adult=false&region=US&year=1999&primary_release_year=1999
# @app.route('/get-movie-details/search?language=<language>&query=<query>&page=<page>&include_adult=<adult>&region=<region>&year=<year>&primary_release_year=<release_year>',methods=['GET','POST'])
@app.route('/get-movie-details')
# @app.route('/get-movie-details/search?<query>')
# def get_movie_details(language,query,page,adult,region,year,release_year):
def get_movie_details():
	data = request.args
	url = "https://api.themoviedb.org/3/search/movie?api_key=%s&language=%s&query=%s&page=%s&include_adult=%s&region=%s&year=%s&primary_release_year=%s" % (API_KEY,data['language'],data['query'],data['page'],data['include_adult'],data['region'],data['year'],data['primary_release_year'])
	# print(request.args);
	# url =  "https://api.themoviedb.org/3/search/movie?\
	# 		api_key=%s&\
	# 		language=%s&\
	# 		query=%s&\
	# 		page=%s&\
	# 		include_adult=%s&\
	# 		region=%s&\
	# 		year=%s&\
	# 		primary_release_year=%s" % (API_KEY,language,query,page,adult,region,year,release_year)
	# url =  "https://api.themoviedb.org/3/search/movie?\
	# 		api_key=%s&%s" % (API_KEY,query)
	print(url)
	return requests.get(url).text