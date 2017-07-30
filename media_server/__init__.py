from flask import Flask,render_template,request,redirect,url_for
import sys

app = Flask(__name__)
app.config.from_object('media_server.config')

# connect('mongodb://localhost:27017/media-server')

import media_server.lib
# from media_server.lib import *
import media_server.views