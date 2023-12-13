# MERN-Stack-Project

Install nodejs, reactjs

https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/



npm install express mysql cors nodemon



MYSQL Configuration
```
CREATE DATABASE school;
```
```
USE school;
```
```
CREATE TABLE student (id INT AUTO_INCREMENT PRIMARY KEY, name varchar(40), roll_number int, class varchar(16));
```
```
CREATE TABLE teacher (id INT AUTO_INCREMENT PRIMARY KEY, name varchar(40), subject varchar(40), class varchar(16));
```



Backend-

Install nodejs
npm install dotenv
Modify the .env and do the changes for database

npm install -g pm2   

pm2 start npm --name backend -- start


Frontend
Modify the .env file and update the backend api endpoint 

