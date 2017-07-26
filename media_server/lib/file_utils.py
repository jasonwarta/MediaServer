
import os
import glob
import sys
import re
import time
import subprocess
import datetime
import requests,json,sys
import operator

import requests,json,sys
from sys import stdout, exit
from os import listdir, rename, _exit,path,makedirs,rename,sep,walk
from os.path import isfile, join, isdir, basename

def ext(fname):
	ext = fname.split('.')[-1:][0]
	return ext

def name(fname):
	name = '.'.join(fname.split('.')[0:-1])
	return name

def list_files(folder):
	list_of_files =[]
	stdout.write("Indexing "+folder)
	for root,dirs,files in walk(folder):
		path = root.split(sep)
		for file in files:
			if name(file)[0:2] != "._" and name(file) != '.DS_Store':
				list_of_files.append({
					'path': '/'.join(path)+'/'+file,
					'file': file,
					'name': name(file)
				})
	stdout.write('\n')
	list_of_files.sort(key=operator.itemgetter('name'))
	return list_of_files

def rescan_base_dir(file_path=None):
	if file_path is not None:
		files_list = list_files(file_path)
		return files_list