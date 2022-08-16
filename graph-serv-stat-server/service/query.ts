import { db, TABLENAME } from "../database/sqlite.ts";
import { statusData } from "../models/statusData.ts";

export function getInformation() {
      let result = db.query("SELECT name FROM people");
    let newRows = []
    for (const [name] of result) {
                console.log('name',name);
                newRows.push(['1',name] as string[]);
              }
    console.log('result',result)
    console.log('newRows',newRows)
  return newRows;
}

export function saveServerInfo(data: statusData) {

    db.query(`
    CREATE TABLE IF NOT EXISTS server (
      host TEXT PRIMARY KEY,
      name TEXT,
      hdd_total INTEGER
    )
  `);

  `
  INSERT INTO ${TABLENAME.server} 
   (host, hdd_total)
   SELECT  
      '${data.host}' as name,
      '${data.hdd_total}' as hdd_total
   FROM ${TABLENAME.server} 
       WHERE NOT EXISTS(SELECT * FROM ${TABLENAME.server} WHERE host = '${data.host}') LIMIT 1;
  Update ${TABLENAME.server}  SET host='${data.host}' WHERE host='${data.host}';
  `


}

function saveServerStatus(data: statusData, columnsToInsert: string) {
  let x = `
  INSERT INTO ${TABLENAME.server} 
   (host, hdd_total)
   SELECT  
      '${data.host}' as name,
      '${data.hdd_total}' as hdd_total
   FROM ${TABLENAME.server} 
       WHERE NOT EXISTS(SELECT * FROM ${TABLENAME.server} WHERE host = '${data.host}') LIMIT 1;
  Update ${TABLENAME.server}  SET host='${data.host}' WHERE host='${data.host}';
  `;

  let statement =
  `
  INSERT INTO ${TABLENAME.status}  (column1,column2 ,..)
  VALUES( value1,	value2 ,...);
  `;
}