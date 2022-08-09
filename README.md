# Contest API
Contest API for my full-stack contest app.

## To run:
1. Install [MongoDB](https://www.mongodb.com/try/download/community)
2. Create MongoDB database to use for the contests. Make sure the name is the same as `DB_NAME` in `db.js`
3. Run `npm install` to install the package dependancies.
4. Run `node generateEnv.js` to generate the `.env` file that contains the port and app secret key.
5. Then run `node app.js` or `nodemon app.js` to run the API server.

#### Now you can download and configure the [client](https://github.com/JamminCoder/contest-client)