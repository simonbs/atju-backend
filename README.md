# Atju Backend

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Atju is a project for monitoring pollen readings in Denmark. Data is obtained from DMI. The application polls DMI for new pollen readins and stores them in a database. The readings are exposed through a tiny API. The readings can be viewed using the [Atju iOS app](https://github.com/simonbs/atju), which is also open source.

![](https://raw.githubusercontent.com/simonbs/atju-backend/master/icon.png)

## Installation

You can deploy to Heroku by pressing the above button or you can deploy manually using the following steps.

1. Install the necessary dependencies by running `npm install`.
2. Make sure that you have PostgreSQL running. 
3. Create a database named "atju". The database can typically be created by running `createdb atju`.
4. Modify `config/default.json` as necessary.
5. Set the environment variable `DATABASE_URL` to the a URL pointing to your PostgreSQL or MySQL database.
6. Set the environment variable `URBAN_AIRSHIP_APP_KEY` to the Urban Airshp app key.
6. Set the environment variable `URBAN_AIRSHIP_APP_SECRET` to the Urban Airshp app secret.
6. Set the environment variable `URBAN_AIRSHIP_MASTER_SECRET` to the Urban Airshp master secret.

## Running the application

Run the app in a development environment using `npm run start-dev` and in a production environment using `npm start`.

The app will poll DMI for new pollen readings every 15 minute when run in a production environment. When running in a development environment, you can run `npm run refresh` to poll for new readings.

