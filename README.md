# Rafiky

# Before run: 

  - Host a meeting in zoom through https://zoom.us/
  - After host you will have meeting id like 123034123 and password 123456
  - Once you get meeting id and password you need to add it in project file
  - if .env file not exist then Create .env file in root of the folder. Once you create please add databse information in it like `RDS_HOSTNAME=
RDS_USERNAME=
RDS_PASSWORD=
RDS_PORT=3306
MYSQL_DATABASE=
API_KEY=
API_SECRET=`
 - Once you created .env file you need to add meetingid and password in `meetConfig`
 - In `components/NOSSRComponent/Zoom.js` you need to add `apiKey , apiSecret, meetingNumber , passWord` 
 - Make sure your meeting is already hosted and in running state

### Installation
Install the dependencies and devDependencies and start the server.

```sh
$ npm install 
$ npm run dev
```

For production environments...

```sh
$ npm install
$ npm run build 
$ npm start 
```