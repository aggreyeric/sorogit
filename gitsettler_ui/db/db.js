import { createClient } from "@libsql/client";// import sqlite3 from 'sqlite3'


export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});



// import { open } from 'sqlite'


// // Open SQLite database connection
// export async function openDb() {
//   return open({
//     filename: './mydb.db',
//     driver: sqlite3.Database
//   })  
// }

