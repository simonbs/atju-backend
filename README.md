# Atju Backend

Atju is a project for monitoring pollen readings in Denmark. Data is obtained from DMI. The application polls DMI for new pollen readins and stores them in a database. The readings are exposed through a tiny API.

## Installation

Follow the steps below in order to install the backend.

1. Install the necessary dependencies by running `npm install`.
2. Make sure that you have PostgreSQL running. 
3. Create a database named "atju". The database can typically be created by running `createdb atju`.
4. Copy `config/default.json` to `config/local.json` and modify the values as necessary.
5. If you wish to receive a notification whenever new pollen readings are available, register on Urban Airship and follow their guides on creeating production and development applications. Enter the necessary keys in `config/local.json`.

You can configure the application to use another database (e.g. MySQL or SQLite) by modifiying `config/local.json`.

## Running the application

Run the app in a development environment using `npm run start-dev` and in a production environment using `npm start`.

The app will poll DMI for new pollen readings every 15 minute when run in a production environment. When running in a development environment, you can run `npm run refresh` to poll for new readings.

I recommend deploying the app using [PM2](https://github.com/Unitech/pm2).
