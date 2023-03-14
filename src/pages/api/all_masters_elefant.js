// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pg from "postgres"

export default async function handler(req, res) {
    var conString = "postgres://vllxvigu:ldlX4GqmlgIhHNhjdY_z2p2HQ53T3bRP@mouse.db.elephantsql.com/vllxvigu" //Can be found in the Details page
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('SELECT NOW() AS "theTime"', function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
        // >> output: 2018-08-23T14:02:57.117Z
        client.end();
      });
    });
  
}