const { Client } = require('pg');
const url = process.env.DATABASE_URL;
(async function(){
  if(!url){console.error('No DATABASE_URL'); process.exit(2)}
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try{
    await client.connect();
    const res = await client.query('select now()');
    console.log('connected, now=', res.rows[0]);
    await client.end();
    process.exit(0);
  }catch(e){
    console.error('pg error', e);
    process.exit(1);
  }
})();
