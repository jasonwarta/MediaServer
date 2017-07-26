from flask import Flask,render_template,request,redirect,url_for
from flask_login import LoginManager
# from flask_bcrypt import Bcrypt
# from flask_mail import Mail
import sys

from media_server.lib import *

app = Flask(__name__)
app.config.from_object('media_server.config')
db = connect_to_db('saltybet')

login_manager = LoginManager()
login_manager.init_app(app)

if db is None:
	print('error connecting to db')


import media_server.views