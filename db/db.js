const sqlite3 = require("sqlite3");
const db = new sqlite3("./test.db");

// exports.db = db;


// module.exports.getNames = () =>{
//     const query = 'SELECT * FROM tblTest';
//     let stmt = db.prepare(query)
//     let res = stmt.all();

//     return res;
// }

module.exports.query = (queryString) =>{
    const query = `${queryString}`
    db.prepare(query);
    let res = stmt.all();

    return res;
}