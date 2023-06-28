let pgp = require('pg-promise');

const connections = [];
const dbName = process.env.DBPGNAME;
const dbUser = process.env.DBPGUSER;
const dbPassword = process.env.DBPGPASSWORD;
const dbHost = process.env.DBPGHOST;
const dbPort = process.env.DBPGPORT;

const dbc = pgp({ capSQL: true});
console.log(`Opening connection to: ${dbName}, host is: ${dbHost}`);

let connection = dbc( `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?ssl=true`);
   
export default class RawReportingEventsRepository {

    queryRawEvents = async(query) => {
        return connection.query(query)
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            console.error(err);
        });
    }
}

