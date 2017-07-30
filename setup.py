#!/usr/bin/env python3.4

from setuptools import setup

setup(
	name='media_server',
	packages=['media_server'],
	include_package_data=True,
	install_requires=[
		'appdirs',
		'argh',
		'blinker',
		'click',
		'decorator',
		'enum-compat',
		'eventlet',
		'falcon',
		'Flask',
		'greenlet',
		'gunicorn',
		'infinity',
		'intervals',
		'itsdangerous',
		'Jinja2',
		'MarkupSafe',
		'mongoengine',
		'nodejs',
		'packaging',
		'pathtools',
		'pip',
		'pycparser',
		'PyExecJS',
		'pymongo',
		'requests',
		'setuptools',
		'six',
		'validators',
		'watchdog',
		'wheel',
		'pymodm',
		'uwsgi'
	]
)

