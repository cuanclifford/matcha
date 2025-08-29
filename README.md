This is an overview of the setup to run Matcha:

Setting up the poastgresql server:
Install postgresql with relevant package manager

This link will explain how to set up postgres:

https://wiki.archlinux.org/index.php/PostgreSQL

Make sure to:
- Initialize the Database Cluster
- Start and enable the posrgres service

https://wiki.archlinux.org/index.php/Systemd#Using_units

- Create a user for the postgres shell
- Use your OS username to make it easier to log in

Two instances of npm have to be run:
cd into app and server in two seperate terminals
run npm install && npm update in both
next run npm start in both

Site is hosted on:

	http://localhost:3000/
