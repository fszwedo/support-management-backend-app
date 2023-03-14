var Redshift = require('node-redshift');
 var client = {
  user: 'gbochniak',
  database: 'prod',
  password: 'er_]Aytw>.nB,TJ,SI16_Y7Zf',
  port: 5439,
  host: 'prod-tracking.cjk1id3qusgl.eu-west-1.redshift.amazonaws.com',
};

var redshiftClient = new Redshift(client);

export default class rawReportingEventsRepository {

    queryRawEvents = async(query) => {

        return redshiftClient.rawQuery(query, { raw: true})
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            console.error(err);
        });
    }
}

const repo = new rawReportingEventsRepository;
repo.queryRawEvents('SELECT * from event limit 1;');
