# Atju Backend

Atju is a project for monitoring pollen readings in Denmark. Data is obtained from DMI. The application polls DMI for new pollen readins and stores them in a database. The readings are exposed through a tiny API.

## Usage

In order to run the app, you should first install the dependencies using `npm install`. Make sure you have PostgreSQL running and have a database named "atju". On OS X, a database can be created using `createdb atju`. You can configure the app to use another database (e.g. MySQL or SQLite) by modifying `config/default.json` or preferably create `config/local.json` to override the defaults.

- Run the app in a development environment using `npm run start-dev`.
- Run the app in a production environment using `npm start`.

The app will poll DMI for new pollen readings every 15 minute when run in a production environment. When running in a development environment, you can run `npm run refresh` to poll for new readings.

I recommend deploying the app using [PM2](https://github.com/Unitech/pm2).
