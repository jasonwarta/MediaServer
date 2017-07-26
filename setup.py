#!/usr/bin/env python3.4

from setuptools import setup

setup(
	name='media_server',
	packages=['media_server'],
	include_package_data=True,
	install_requires=[
		'appdirs',
		'argh',
		'auth',
		'bcrypt',
		'blinker',
		'cffi',
		'click',
		'decorator',
		'enum-compat',
		'eventlet',
		'falcon',
		'Flask',
		'Flask-Bcrypt',
		'Flask-Funnel',
		'Flask-Login',
		'Flask-Mail',
		'Flask-Script',
		'flask-stylus2css',
		'Flask-User',
		'Flask-WTF',
		'greenlet',
		'gunicorn',
		'infinity',
		'intervals',
		'itsdangerous',
		'Jinja2',
		'live-stylus',
		'MarkupSafe',
		'mongoengine',
		'nodejs',
		'olefile',
		'optional-django',
		'packaging',
		'passlib',
		'pathtools',
		'phonenumbers',
		'pip',
		'pycparser',
		'pycryptodome',
		'PyExecJS',
		'pymongo',
		'pyotp',
		'pyparsing',
		'python-mimeparse',
		'PyYAML',
		'qrcode',
		'requests',
		'setuptools',
		'six',
		'stylus',
		'validators',
		'Wand',
		'watchdog',
		'Werkzeug',
		'wheel',
		'WTForms',
		'WTForms-Components',
		'WTForms-JSON',
	]
)

