let v4 = require("uuid");
let neo4j = require("neo4j-driver");
require("dotenv").config();
let driver = neo4j.driver(
  process.env.NEO4J_URL,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PW)
);

exports.getTimeStamp = () => {
  let date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1; // beware: January = 0; February = 1, etc.
  let day = date.getDate();

  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let hour = date.getHours();

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

exports.getQueryStringRel = (attributes) =>  {
  let {
    first,
    second,
    direction,
    title,
    type,
    attrib1,
    attrib2,
    attrib3,
    attrib4,
  } = attributes;
  const arrayLength = first.length;

  let matchStr = "MATCH ";
  first.map((v, index) => {
    matchStr += `(a${index} {guid:'${v}'}), `;
  });
  matchStr += `(b {guid:'${second}'})`;

  let creatStr = " CREATE ";
  let returnStr = " RETURN ";

  first.map((v, index) => {
    // let ids = uuidv4();
    let ids = v4();

    let d1 = "";
    let d2 = "";
    if (direction == "from-to") {
      d2 = ">";
    } else if (direction == "to-from") {
      d1 = "<";
    }
    let str1 = `${d1}-[r${index}:${title} {created: '${getTimeStamp()}'}]-${d2}(b)`;

    creatStr += `(a${index})${str1}`;

    returnStr += `r${index}`;
    
    if (arrayLength !== index + 1) {
        creatStr += ", ";
        returnStr += ', ';
      }
  });

  let query = matchStr + creatStr + returnStr;
  console.log(query);
  return query;
}

exports.apiCall = async (query, queryObject) => {
  const session = await driver.session();
  try {
    let res = await session.run(query, queryObject);
    return {res, queryObject};
  } catch (err) {
    console.error(err);
    return err;
  } finally {
    await session.close();
  }
}
