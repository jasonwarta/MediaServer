#!/bin/bash

cd /home/pi/MediaServer/ && source bin/activate && uwsgi --ini media-server.ini 2>&1 >> wsgi.log & disown $!