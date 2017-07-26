import sys
import re
from pymongo import MongoClient, ASCENDING

def connect_to_db(db_name):
	try:
		client = MongoClient(host="localhost",port=27017)
	except Exception(e):
		sys.stderr.write("Could not connect to MongoDB: %s" % e)
		sys.exit(1)

	db = client[str(db_name)]

	if str(db).find(str(client)) != -1:
		return db
	else:
		sys.stderr.write("Error connecting to DB")

	return None

def update_books(file_path=None):
	from media_server.lib.file_utils import rescan_base_dir

	db = connect_to_db('books')
	books = db['books']

	files_list = rescan_base_dir(file_path)

	for item in files_list:
		books.update(
			{
				"name" : item['name']
			},
			{
				"path" : item['path'],
				"file" : item['file'],
				"name" : item['name']
			},
			upsert=True
		)
	return "success"

def get_books_list():
	db = connect_to_db('books')
	return db['books'].find()

def search_db(category=None, search_string=None):
	db = connect_to_db(category)

	if search_string is not None:
		query = re.compile(search_string, re.IGNORECASE)

		if category == 'tv':
			return db[str(category)].find({"name" : query}).sort([
				('series', ASCENDING ),
				('season', ASCENDING ),
				('name'  , ASCENDING )
			])
		
		return db[str(category)].find({"name" : query})
	else:
		if category == 'tv':
			return db[str(category)].find().sort([
				('series', ASCENDING ),
				('season', ASCENDING ),
				('name'  , ASCENDING )
			])
		return db[str(category)].find()

def update_movies(file_path=None):
	from media_server.lib.file_utils import rescan_base_dir

	db = connect_to_db('movies')
	movies = db['movies']

	files_list = rescan_base_dir(file_path)

	for item in files_list:
		movies.update(
			{
				"name" : item['name']
			},
			{
				"path" : item['path'],
				"file" : item['file'],
				"name" : item['name']
			},
			upsert=True
		)
	return "success"

def update_tv(file_path=None):
	from media_server.lib.file_utils import rescan_base_dir

	db = connect_to_db('tv')
	tv = db['tv']

	files_list = rescan_base_dir(file_path)

	for item in files_list:
		details = item['path'].split('/')[-3:]
		tv.update(
			{
				"name" : item['name']
			},
			{
				"path" : item['path'],
				"file" : item['file'],
				"name" : item['name'],
				"series" : details[0],
				"season" : details[1],
				"episode" : details[2]
				
			},
			upsert=True
		)
	return "success"