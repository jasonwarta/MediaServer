# MediaServer
### Media Server designed to run on a RaspberryPi or other dedicated server
  
  
### Installation Instructions:  

##### Install mongodb
```
$ sudo apt-get install mongodb
```
Create databases with names `tv`, `movies`, and `books`
```
$ mongo
> use tv
> use movies
> use books
```

##### Install python3.4
```
$ sudo apt-get install python3.4 virtualenv
```
Clone repo
```
$ git clone https://github.com/jasonwarta/MediaServer.git
```
set up virtual environment and install package
```
$ virtualenv --python=python3.4 MediaServer
$ cd MediaServer
$ source bin/activate
$ pip install -e .
```
to run locally as a dev server, enable execution for these two scripts to make your life easier
```
$ chmod +x startup.sh
$ chmod +x restart.sh

```
To start or resetart the server, run
`./startup.sh` or `./restart.sh`

Check the paths in `media-server.ini` to ensure they match your configuration.
```
[uwsgi]
logto = /home/pi/MediaServer/wsgi.log

wsgi-file = wsgi.py
callable = app

master = true
processes = 5

socket = /tmp/media-server.sock
chmod-socket = 666
vacuum = true

die-on-term = true
```

Check the paths in `start_media_server.sh` to ensure that they match your configuration.
```
cd /home/pi/MediaServer/ && source bin/activate && uwsgi --ini media-server.ini 2>&1 >> wsgi.log & disown $!
```
Make the startup script executable with `chmod +x start_media_server.sh`, and add a line to your crontab to ensure that it runs on startup.
Run `sudo crontab -e` and add `@reboot /home/pi/MediaServer/start_media_server.sh` the bottom of the file.

### Install nginx
Run `sudo apt-get install nginx` and configure a new site with `sudo nano /etc/nginx/sites-available/media-server`. Paste in the config below and make required changes to the paths to point nginx at your file locations.
  
##### Nginx Sample Config  
```
server {
    listen 80;

    location /movies {
        alias /var/www/drive/movies;
    }

    location /tv {
        alias /var/www/drive/tv;
    }

    location /allitebooks {
        alias /var/www/drive/allitebooks;
    }

    location / {
        include uwsgi_params;
        uwsgi_pass unix:/tmp/media-server.sock;
    }
}
```