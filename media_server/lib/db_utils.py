import sys
import re
from pymongo import MongoClient, ASCENDING
from pymodm import connect
from bson import Binary, Code
from bson.json_util import dumps

from media_server.lib.file_utils import *
from media_server.lib.models import *

def get_results(Object=None,query_obj=None):
	if Object is not None and query_obj is not None:
		results = Object.objects.raw(query_obj)
		json_results = []
		for item in results:
			json_results.append(dumps(item.to_son()))
		return json_results
	else:
		print("get_results called without an Object or query")
		return None

def get_all(Object=None):
	if Object is not None:
		results = Object.objects.all()
		json_results = []
		for item in results:
			json_results.append(dumps(item.to_son()))
		return json_results
	else:
		print("get_all was called without an Object")
		return None

def search_db(collection=None, search_string=None):
	if search_string is not None:
		query = re.compile(search_string, re.IGNORECASE)

		if collection == 'movies':
			return get_results(Movie, {"name" : query})
		elif collection == 'tv':
			return get_results(TV, {"name" : query})
		elif collection == 'books':
			return get_results(Book, {"name" : query})
		else:
			print("Invalid Collection: " + collection)
			return "Invalid Collection: " + collection
	else:
		if collection == 'movies':
			return get_all(Movie)
		elif collection == 'tv':
			return get_all(TV)
		elif collection == 'books':
			return get_all(Book)
		else:
			print("Invalid Collection: " + collection)
			return "Invalid Collection: " + collection

def update_books(file_path=None):
	files_list = rescan_base_dir(file_path)

	for item in files_list:
		Book(
			name = item['name'],
			path = item['path'],
			file = item['file'],
			file_id = item['file']
		).save()
	return "success"

def update_movies(file_path=None):
	files_list = rescan_base_dir(file_path)

	for item in files_list:
		Movie(
			name = item['name'],
			path = item['path'],
			file = item['file'],
			file_id = item['file']
		).save()
	return "success"

def update_tv(file_path=None):
	files_list = rescan_base_dir(file_path)

	for item in files_list:
		details = item['path'].split('/')[-3:]
		TV(
			path    = item['path'],
			file    = item['file'],
			name    = item['name'],
			series  = details[0],
			season  = details[1],
			episode = details[2],
			file_id = item['file']
		).save()
	return "success"