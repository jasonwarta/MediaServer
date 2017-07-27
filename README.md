# MediaServer
### Media Server designed to run on a RaspberryPi or 
  
  
##### startup instructions:  
Clone the repo  
Install python3.4  
If you are running multiple version of python, you will need to configure a virtual environment for the project, to enforce python3.4 and pip3.  

Before starting the webserver, install mongodb and create databases with names `tv` and `movies`

Then from the root of the project directory, install and set up the server by running these
```
pip install -e .
chmod +x startup.sh
chmod +x restart.sh
```
To start or resetart the server, run
`./startup.sh` or `./restart.sh`
  
  
  
#Nginx Sample Config  
```server {
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