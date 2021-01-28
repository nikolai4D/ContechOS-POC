const express = require("express");
const api = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const prop = require("./api-helpers");
let { v4 } = require("uuid");

api.use(bodyParser.json());
api.use(cors());
api.use(express.urlencoded({ extended: true }));

// Auth

api.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  let query =
    "Match (a:User {email: $email}) with {name: a.name, email: a.email, guid:a.guid, neoId: toString(id(a)), created: a.created, password: a.password, admin: a.admin} as obj RETURN collect(distinct obj) as user";
  let queryObject = {
    email,
  };

  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0].get(0)[0];

  if (result != null && result.email == email) {
    return res
      .status(409)
      .send({ message: "Ett konto med epostradressen har redan skapats." });
  }
  query =
    "CREATE (a:User {name: $name, email: $email, password: $password, guid:$guid, created: $created}) RETURN a";

  queryObject = {
    name,
    email,
    password,
    guid: v4(),
    created: prop.getTimeStamp(),
  };
  response = await prop.apiCall(query, queryObject);
  result = response.queryObject;

  res.json({ email, password, name });

  return result;
});

api.post("/login", async (req, res) => {
  let query =
    "Match (a:User {email: $email}) with {password: a.password} as obj RETURN collect(distinct obj) as user";
  let queryObject = {
    email: req.body.email,
  };
  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0].get(0)[0];

  if (result == null) {
    return res
      .status(404)
      .send({ message: "Epostadressen är inte registrerad." });
  }
  return res.send({
    data: result.password,
    message: "Epostadress finns i databas.",
  });
});

api.post("/loginAuth", async (req, res) => {
  let query =
    "Match (a:User {email: $email}) SET a.token=$token with {name: a.name, email: a.email, guid:a.guid, token: a.token} as obj RETURN collect(distinct obj) as user";
  let queryObject = {
    email: req.body.email,
    token: req.body.token,
  };
  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0].get(0)[0];

  return res.send({ data: result, message: "Användaren är inloggad." });
});

api.post("/logout", async (req, res) => {
  let query =
    "Match (a:User {token: $token}) REMOVE a.token with {guid:a.guid} as obj RETURN collect(distinct obj) as user";
  let queryObject = {
    token: req.body.token,
  };
  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0].get(0)[0];

  return res.send({ data: result, message: "Användaren är utloggad." });
});

api.post("/tokenVal", async (req, res) => {
  let query =
    "Match (a:User {token: $token}) with {guid:a.guid} as obj RETURN collect(distinct obj) as user";
  let queryObject = {
    token: req.body.token,
  };
  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0].get(0)[0];
  if (result == null) {
    return res.send(false);
  }
  return res.send(true);
});

// readNodeRels

// readNodesRels

//CREATE (f:Fastighet {title:'Fastighet1})-[r:`INGÅR_I_FASTIGHETSBESTÅND`]->(fb:Fastighetsbestånd) CREATE (f:Fastighet {title:'Fastighet2})-[r:`INGÅR_I_FASTIGHETSBESTÅND`]->(fb:Fastighetsbestånd) CREATE (f:Fastighet {title:'Fastighet3})-[r:`INGÅR_I_FASTIGHETSBESTÅND`]->(fb:Fastighetsbestånd) CREATE (f:Fastighet {title:'Fastighet4})-[r:`INGÅR_I_FASTIGHETSBESTÅND`]->(fb:Fastighetsbestånd) CREATE (f:Fastighet {title:'Fastighet5})-[r:`INGÅR_I_FASTIGHETSBESTÅND`]->(fb:Fastighetsbestånd) CREATE (f:Fastighet {title:'Fastighet6})-[r:`INGÅR_I_FASTIGHETSBESTÅND`]->(fb:Fastighetsbestånd)

api.post("/readNodeParents", async (req, res) => {
  let query = `MATCH (n0:${req.body.nodeType}) where not exists (()<-[]-(n0)) OPTIONAL MATCH (n1)-[]->(n2:${req.body.nodeType}) where not exists (()<-[]-(n2)) with collect(distinct({id:toString(id(n0)), title:n0.title,type:labels(n0)[0]})) as ns with {nodes: ns}  as result RETURN apoc.convert.toJson(result)`;

  let response = await prop.apiCall(query);
  let result = JSON.parse(response.res.records[0].get(0));

  res.send(result);
});

api.post("/readNodeChildren", async (req, res) => {
  let query = `Match (child)-[r]->(parent) where id(parent)=${req.body.id} with collect({title:child.title,id:toString(id(child)),type:labels(child)[0], color:1}) as ns, collect({id:toString(id(r)),source: toString(id(child)),target: toString(id(parent)), title: TYPE(r)}) as edgs Match (parent) where id(parent)=${req.body.id} with {title: parent.title, id:  toString(id(parent)), type: labels(parent)[0], nodes: ns, edges: edgs, color:2} as json RETURN apoc.convert.toJson(json) as obj`;

  let response = await prop.apiCall(query);
  let result = JSON.parse(response.res.records[0].get(0));

  res.send(result);
});

api.post("/readNodes", async (req, res) => {
  let query = `MATCH (n0:${req.body.nodeType})-[:HAS_PROPVAL]->(pv)-[:HAS_PROP]->(p)
  OPTIONAL MATCH (n1)-[r]->(n2:${req.body.nodeType})-[:HAS_PROPVAL]->(:PropVal) 
  with id(n0) as nid, r,n1,n2, collect(distinct({key: p.key, value: pv.value})) as propts,n0
  with {id: toString(nid), props: propts, labels:labels(n0) } as nds, r,n1,n2
  with collect(distinct({id:toString(id(r)), source:toString(id(n1)), target:toString(id(n2)),title: TYPE(r)})) as edgz, nds
  with collect(nds) AS ndss, edgz
  with { nodes: ndss, rels: [ val in edgz where val.source is not null]} as json
  
  RETURN apoc.convert.toJson(json)`;

  let response = await prop.apiCall(query);
  if (response.res.records[0] == null) {
    res.send({ nodes: [], rels: [] });
  } else {
    let result = JSON.parse(response.res.records[0].get(0));

    res.send(result);
  }
});

api.post("/readConfig", async (req, res) => {
  let query = `MATCH (n0:${req.body.configType})
  OPTIONAL MATCH (n1:${req.body.configType})-[r]->(n2:${req.body.configType})
  with id(n0) as nid,n0,r,n1,n2
  with {id: toString(nid), props:[properties(n0)],labels:labels(n0) } as nds, r,n1,n2
  with collect(distinct({id:toString(id(r)), source:toString(id(n1)), target:toString(id(n2)),title: TYPE(r)})) as edgz, nds
  with collect(nds) AS ndss, edgz
  with { nodes: ndss, rels: [ val in edgz where val.source is not null]} as json
  
  RETURN apoc.convert.toJson(json)`;
  console.log(query);

  let response = await prop.apiCall(query);
  if (response.res.records[0] == null) {
    res.send({ nodes: [], rels: [] });
  } else {
    let result = JSON.parse(response.res.records[0].get(0));

    res.send(result);
  }
});

api.post("/readModel", async (req, res) => {
  console.log(req.body);
  let query = `MATCH (n0:${req.body.selectedGraph}) where not n0:ChildProp and not n0:Prop
  optional match (n0)-[:HAS_PROPVAL]->(pv0:PropVal)-[:HAS_PROP]->(p0)
  optional match (n0)-[:HAS_CHILDPROP]->(cp0)
  optional match (nr0: ${req.body.selectedGraph})-[r]->(nr1: ${req.body.selectedGraph}) where not nr0:ChildProp and not nr1:ChildProp
   
  with n0, collect({keyId:ID(p0),key:p0.value,valueId:ID(pv0),value:pv0.value}) as prp,cp0,nr0,r,nr1
  with n0, collect({keyId:ID(cp0),key:cp0.value}) as cprp,prp,nr0,r,nr1
  with collect({id: toString(ID(n0)), props:prp, childProps:[val in cprp where not val.keyId is null],labels:labels(n0)}) as nds,nr0,r,nr1
  with collect(distinct({id:toString(id(r)), source:toString(id(nr0)), target:toString(id(nr1)),title: TYPE(r)})) as edgs,nds
  with { nodes: nds, rels: [ val in edgs where val.source is not null]} as json
  RETURN apoc.convert.toJson(json)`;

  let response = await prop.apiCall(query);
  if (response.res.records[0] == null) {
    res.send({ nodes: [], rels: [] });
  } else {
    let result = JSON.parse(response.res.records[0].get(0));

    res.send(result);
  }
});

api.get("/getConfigDataTypes", async (req, res) => {
  let query =
    "MATCH (m:ConfigRelDataType), (n:ConfigNodeDataType) with collect(properties(n)) as prps, m  with collect(properties(m)) as relprps, prps with {node: {props:prps}, rel: {props:relprps}} as result  RETURN apoc.convert.toJson(result)";
  let response = await prop.apiCall(query);
  let result = response.res.records[0].get(0);

  res.send(result);
});

api.post("/getConfigConfigRel", async (req, res) => {
  console.log(req.body);
  let query = `MATCH (n0:Config:${req.body.title})-[:HAS_REL]->(n1) with collect({id:ID(n1),key:n1.key, value:n1.value}) as prps with {rels:prps} as json RETURN apoc.convert.toJson(json)`;
  let response = await prop.apiCall(query);
  let result = response.res.records[0].get(0);

  res.send(result);
});

api.post("/getConfigConfigNodes", async (req, res) => {
  console.log(req.body);

  let query = `MATCH (n0)-[r]->(n1) where ID(n0)=${req.body.id} with n0,n1,r, collect([val in labels(n1) where not val in ["Config", "AdminConfig","SystemConfig","InformationConfig", "DataConfig"]]) as lbl unwind lbl as lb unwind lb as l with collect({nodeLabel:l,id:ID(n1),key:n1.key, value:n1.value, Rel:Type(r)}) as prps with {nodes:prps} as json RETURN apoc.convert.toJson(json)`;

  let response = await prop.apiCall(query);
  let result = response.res.records[0].get(0);

  res.send(result);
});

api.post("/getAdminConfigRels", async (req, res) => {
  console.log(req.body);

  let query = `match (n0:Config:${req.body.obj.from})-[:HAS_REL]->(n)-[:TO_NODE]->(n1:Config:${req.body.obj.to}) with n,n0,n1, collect([val in labels(n) where not val in ["Config", "AdminConfig","SystemConfig","InformationConfig", "DataConfig"]]) as lbl unwind lbl as lb unwind lb as l with collect({id:ID(n),label:l, key:n.key, value:n.value}) as rls with {rels:rls} as json RETURN apoc.convert.toJson(json)`;
  let response = await prop.apiCall(query);
  let result = response.res.records[0].get(0);
  console.log(query);

  res.send(result);
});

api.post("/getAsidRootConfig", async (req, res) => {
  console.log(req.body);
  let label = req.body.selectedGraph + "Config";

  let query = `match (n:${label}:Node{value:"root"})  
  optional match (n)-[:HAS_LABELVAL]->(lv1:LabelVal)-[:HAS_LABEL]->(l1:Label)<-[:HAS_LABEL]-(n) 
  optional match (p1:Prop:Config)-[:HAS_DATATYPE]->(dt1:DataType) 
  
  with l1, collect({key:l1.value, value:lv1.value, keyId:id(l1),valueId:id(lv1)}) as lbl,n,p1,dt1 
  unwind(lbl) as lbl0 with collect(lbl0) as lbl1,n,p1,dt1
  with p1, collect({key:p1.value, keyId:id(p1),dataType:dt1.value,dataTypeId:ID(dt1)}) as prpX,n,lbl1
  with collect(prpX) as prpXX,n,lbl1
  unwind(prpXX) as prp
  unwind(prp) as prp0 
  with collect(prp0) as prp1,n,lbl1 

  with {node:{configNodeId:id(n),labels:lbl1,props:prp1}} as json RETURN apoc.convert.toJson(json)
  `;

  let response = await prop.apiCall(query);
  let result = response.res.records[0].get(0);
  console.log(query);

  res.send(result);
});

api.post("/getAsidChildProps", async (req, res) => {
  let query = `optional match (p:ChildProp:${req.body.selectedGraph}) where not p.value="" 
  optional match (dt:DataType:Config) where not dt.value="" 
  with collect({id:id(p),key:p.key, value:p.value}) as prps,dt 
  with collect({id:id(dt),key:dt.key, value:dt.value}) as dts,prps 
  with ({props:[val in prps where val.key is not null],dataTypes:[val in dts where val.key is not null]}) as json return apoc.convert.toJson(json)`;

  let response = await prop.apiCall(query);
  let result = response.res.records[0].get(0);
  console.log(query);

  res.send(result);
});

api.post("/getSystemRootConfig", async (req, res) => {
  console.log(req.body);
  let label = req.body.selectedGraph + "Config";

  let queryFirst=`match (n:${label}:Node{value:"root"})
  optional match (n)-[:HAS_PARENTCONFIG]->(pc:${label}:Node)
  with {parentConfig:pc.value} as json
  RETURN apoc.convert.toJson(json)`;
  
  let responseFirst = await prop.apiCall(queryFirst);
  let parentConfigRes = JSON.parse(responseFirst.res.records[0].get(0)).parentConfig
  
  let query1 = `match (n:${label}:Node{value:"root"})
 
  
 
  
 //hämta parents
  optional match (parent)-[:HAS_CONFIG]->(parentConfig:${parentConfigRes}{value:"root"}) where not (parent)-[]->()-[]->(parentConfig)
  //hämta labels
  optional match (n)-[:HAS_LABELVAL]->(lv1:LabelVal)-[:HAS_LABEL]->(l1:Label)<-[:HAS_LABEL]-(n) 
  
 //hämta childprops för varje parent
  optional match (dtcp:DataType)<-[:HAS_DATATYPE]-(cp:ChildProp)<-[:HAS_CHILDPROP]-(parent)
  
  // hämta datatyper för config props
  optional match (p1:Prop:Config)-[:HAS_DATATYPE]->(dt1:DataType) 
  
  
  
  with (collect(labels(parent))) as prnts0,n,p1,dt1,l1,lv1,parent,cp,dtcp
  unwind(prnts0) as prnts1
  with collect({keyId:ID(cp),key:cp.value,dataType:dtcp.value,dataTypeId:ID(dtcp)}) as cps,prnts1,n,p1,dt1,l1,lv1,parent
  
  
  
  with collect({valueId:ID(parent),childProps:[val in cps where not val.keyId is null],value:[val in prnts1 where not val in ["Admin","System","Information"]][0]}) as prnts2,n,p1,dt1,l1,lv1
  with collect(prnts2) as prnts3,n,p1,dt1,l1,lv1
  unwind(prnts3) as prnts
  
  
  
  with l1, collect({key:l1.value, value:lv1.value, keyId:id(l1),valueId:id(lv1)}) as lbl,n,p1,dt1,prnts 
  unwind(lbl) as lbl0 with collect(lbl0) as lbl1,n,p1,dt1,prnts
  with p1, collect({key:p1.value, keyId:id(p1),dataType:dt1.value,dataTypeId:ID(dt1)}) as prpX,n,lbl1,prnts
  with collect(prpX) as prpXX,n,lbl1,prnts
  unwind(prpXX) as prp
  unwind(prp) as prp0 
  with collect(prp0) as prp1,n,lbl1,prnts 
  
  with {node:{parentNodes:prnts,configNodeId:id(n),labels:lbl1,props:prp1}} as json RETURN apoc.convert.toJson(json)`

  let response = await prop.apiCall(query1);
  let result = response.res.records[0].get(0);
  console.log(result)

  res.send(result);
});


api.post("/getSystemSub", async (req, res) => {
  console.log(req.body);
  let label = req.body.selectedGraph + "Config";

  let queryFirst=`match (n:${label}:Node{value:"root"})
  optional match (n)-[:HAS_PARENTCONFIG]->(pc:${label}:Node)
  optional match (n)-[:HAS_PARENT]->(p:${label}:Node)
  with {parentConfig:pc.value, parent:p.value} as json
  RETURN apoc.convert.toJson(json)`;
  
  let responseFirst = await prop.apiCall(queryFirst);
  let parentConfigRes = JSON.parse(responseFirst.res.records[0].get(0)).parentConfig
  let parentRes = JSON.parse(responseFirst.res.records[0].get(0)).parent

  let query1 = `match (n:${label}:Node{value:"root"})
  // om ny nod till bef supernode (activenode)
  optional match (activenode) where ID(activenode)=${req.body.id}
  //hämta parents
  optional match (parent:${parentRes})-[parentrel]->()<-[:HAS_PARENT]-(activenode) where not parent:ChildProp
  //hämta labels
  optional match (n)-[:HAS_LABELVAL]->(lv1:LabelVal)-[:HAS_LABEL]->(l1:Label)<-[:HAS_LABEL]-(n)
  //hämta childprops för varje parent
  optional match (dtcp:DataType)<-[:HAS_DATATYPE]-(cp:ChildProp)<-[:HAS_CHILDPROP]-(parent)
  // rels
  optional match (activenode)-[:HAS_PARENT]->()<-[]-()-[reltype]->()<-[:HAS_PARENT]-(rel) where not Type(reltype)="HAS_PARENT" and not Type(reltype)="HAS_PROPVAL" and not Type(reltype)="HAS_CONFIG"
  // hämta datatyper för config props
  optional match (p1:Prop:Config)-[:HAS_DATATYPE]->(dt1:DataType)
 

 with (collect(labels(parent))) as prnts0,n,p1,dt1,l1,lv1,parent,cp,dtcp,rel,parentrel,reltype,activenode
  unwind(prnts0) as prnts1

 with ID(reltype) as rid, collect(distinct({option:[val in labels(rel) where not val in["Admin","System","Information"]][0],optionId:ID(rel)})) as reeeeels,n,p1,dt1,l1,lv1,parent,cp,dtcp,rel,parentrel,prnts1,reltype
 with distinct(ID(reltype)) as rid2, collect(reeeeels) as reeeeels2,n,p1,dt1,l1,lv1,parent,cp,dtcp,rel,parentrel,prnts1,reltype
 unwind (reeeeels2) as reeeeels3
 with collect({relId:rid2,relType:(Type(reltype)), options:reeeeels3}) as optns0,n,p1,dt1,l1,lv1,parent,cp,dtcp,rel,parentrel,prnts1
 unwind (optns0) as optns
  
  with collect({keyId:ID(cp),key:cp.value,dataType:dtcp.value,dataTypeId:ID(dtcp)}) as cps,prnts1,n,p1,dt1,l1,lv1,parent,rel,parentrel,optns
  
  with collect(optns) as rls,cps,prnts1,n,p1,dt1,l1,lv1,parentrel,parent
  
  with parent, collect(Type(parentrel)) as parentrls1,cps,prnts1,n,p1,dt1,l1,lv1,rls
  unwind(parentrls1) as parentrls
 
  with collect({parentRel:parentrls,valueId:ID(parent),rels:rls,childProps:[val in cps where not val.keyId is null],value:[val in prnts1 where not val in ["Admin","System","Information"]][0]}) as prnts2,n,p1,dt1,l1,lv1
  with collect(prnts2) as prnts3,n,p1,dt1,l1,lv1
  unwind(prnts3) as prnts
 
  with l1, collect({key:l1.value, value:lv1.value, keyId:id(l1),valueId:id(lv1)}) as lbl,n,p1,dt1,prnts
  unwind(lbl) as lbl0 with collect(lbl0) as lbl1,n,p1,dt1,prnts
  with p1, collect({key:p1.value, keyId:id(p1),dataType:dt1.value,dataTypeId:ID(dt1)}) as prpX,n,lbl1,prnts
  with collect(prpX) as prpXX,n,lbl1,prnts
  unwind(prpXX) as prp
  unwind(prp) as prp0
  with collect(prp0) as prp1,n,lbl1,prnts
  with {node:{parentNodes:prnts,configNodeId:id(n),labels:lbl1,props:prp1}} as json RETURN apoc.convert.toJson(json)`


  let response = await prop.apiCall(query1);
  let result = response.res.records[0].get(0);
  console.log(result)

  res.send(result);

})

api.post("/createConfigNode", async (req, res) => {
  (created = prop.getTimeStamp()), (guid = v4());

  let query = `create (s:${req.body.labels[0]}:${req.body.labels[1]} {guid:'${guid}', created: '${created}', updated:'${created}', key:'${req.body.props.key}', value:'${req.body.props.value}'}) return s`;

  console.log(query);
  //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

api.post("/createConfigRel", async (req, res) => {
  const { type, to, from } = req.body;

  let query = `MATCH (a) where id(a)=${parseInt(
    to
  )} MATCH (b) where id(b)=${parseInt(
    from
  )} create (a)<-[r:${type} {guid:'${v4()}', created: '${prop.getTimeStamp()}'}]-(b) return a,b,r`;

  let response = await prop.apiCall(query);
  let result = response.res.records[0];
  res.send(result);
});

api.post("/createAsidRel", async (req, res) => {
  const { type, to, from } = req.body;

  let query = `MATCH (a) where id(a)=${parseInt(
    to
  )} MATCH (b) where id(b)=${parseInt(
    from
  )} create (a)<-[r:${type} {guid:'${v4()}', created: '${prop.getTimeStamp()}'}]-(b) return a,b,r`;

  let response = await prop.apiCall(query);
  let result = response.res.records[0];
  res.send(result);
});

api.post("/createConfigNodeRel", async (req, res) => {
  console.log(req.body);
  let dir1 = "";
  let dir2 = "";
  if (req.body.direction == "to") {
    dir1 = `<-`;
    dir2 = "-";
  } else {
    dir1 = `-`;
    dir2 = "->";
  }

  let created = prop.getTimeStamp();

  let query = `MATCH (n0) where ID(n0)=${
    req.body.node.id
  } create (n0)${dir1}[:${
    req.body.rel.type
  } {guid:'${v4()}', created: '${created}', updated:'${created}'}]${dir2}(n1:${
    req.body.node.labels[0]
  }:${req.body.node.labels[1]} {key:'${req.body.node.props.key}', value:'${
    req.body.node.props.value
  }', guid:'${v4()}', created: '${created}', updated:'${created}'}) return n1`;

  console.log(query);
  //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

api.post("/createAdminConfigNode", async (req, res) => {
  (created = prop.getTimeStamp()), (guid = v4());

  let query = `create (s:${req.body.labels[0]}:${req.body.labels[1]} {guid:'${guid}', created: '${created}', updated:'${created}', key:'${req.body.props.key}', value:'${req.body.props.value}'}) return s`;

  console.log(query);
  //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

api.post("/createAdminConfigNodeRel", async (req, res) => {
  console.log(req.body);
  let dir1 = "";
  let dir2 = "";
  if (req.body.direction == "to") {
    dir1 = `<-`;
    dir2 = "-";
  } else {
    dir1 = `-`;
    dir2 = "->";
  }

  let created = prop.getTimeStamp(),
    guid = v4();
  guid1 = v4();

  let query = `MATCH (n0) where ID(n0)=${
    req.body.node.id
  } create (n0)${dir1}[:${
    req.body.rel.type
  } {guid:'${v4()}', created: '${created}', updated:'${created}'}]${dir2}(n1:${
    req.body.node.labels[0]
  }:${req.body.node.labels[1]} {key:'${req.body.node.props.key}', value:'${
    req.body.node.props.value
  }', guid:'${v4()}', created: '${created}', updated:'${created}'}) return n1`;

  console.log(query);
  //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

// create node and rel
api.post("/createRel", async (req, res) => {
  const { nodeType, nodeLabel } = req.body.createObj.node.labels;
  const { type, to, from } = req.body.createObj.rel;

  let query = `MATCH (a) where id(a)=${parseInt(
    to
  )} MATCH (b) where id(b)=${parseInt(
    from
  )} create (a)<-[r:${type} {guid:'${v4()}', created: '${prop.getTimeStamp()}'}]-(b) return a,b,r`;

  console.log(query);

  let response = await prop.apiCall(query);
  let result = response.res.records[0];
  console.log(result);
  res.send(result);
  // res.send(response)
});

api.post("/createRootNode", async (req, res) => {
  let configNodeId = req.body.obj.configNodeId;
  let created = prop.getTimeStamp();

  let labelStrMatch = ` match (configNode) where ID(configNode)=${configNodeId} `;
  let labelStrCreate = ` create (n:${req.body.obj.node.labels[0]}:${
    req.body.obj.node.labels[1]
  } {guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_CONFIG {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(configNode) `;

  let propStrMatch = "";
  let propStrCreate = "";

  req.body.obj.node.props.map((prop, i) => {
    propStrMatch += ` match (p${i}:Prop) where ID(p${i})=${prop.keyId} `;
    propStrCreate += ` create (n)-[:HAS_PROPVAL {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(pv${i}:PropVal {value:'${
      prop.value
    }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_PROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(p${i}) `;
  });

  let childStrMatch = "";
  let childStrCreate = "";

  req.body.obj.node.childProps.map((dt, i) => {
    if (dt.value1.value == null) {
      childStrMatch += ` match (dt${i}:DataType) where ID(dt${i})=${dt.value2} `;
      childStrCreate += `create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i}:ChildProp:${
        req.body.selectedGraph
      } {key:'key',value:'${
        dt.value1
      }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_DATATYPE {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(dt${i}) `;
    } else {
      childStrMatch += `  match (cp${i}:ChildProp) where ID(cp${i})=${dt.value1.id} `;
      childStrCreate += ` create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i})`;
    }
  });
  let query =
    labelStrMatch +
    propStrMatch +
    childStrMatch +
    labelStrCreate +
    propStrCreate +
    childStrCreate;
  console.log(query);
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

api.post("/createSubNodeRel", async (req, res) => {
  console.log(req.body);
  let dir1 = "";
  let dir2 = "";
  if (req.body.direction == "to") {
    dir1 = `-`;
    dir2 = "->";
  } else {
    dir1 = `<-`;
    dir2 = "-";
  }
  let configNodeId = req.body.obj.configNodeId;
  let created = prop.getTimeStamp();

  let superStrMatch = ` match (m) where id(m)=${req.body.obj.node.id} `;

  let labelStrMatch = ` match (configNode) where ID(configNode)=${configNodeId} `;

  let labelStrCreate = ` 
  
  create (m)${dir1}[:${
    req.body.obj.rel.type
  } {guid:'${v4()}', created: '${created}', updated:'${created}'}]${dir2}(n:${
    req.body.obj.node.labels[0]
  }:${
    req.body.obj.node.labels[1]
  } {guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_CONFIG {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(configNode) `;

  let propStrMatch = "";
  let propStrCreate = "";

  req.body.obj.node.props.map((prop, i) => {
    propStrMatch += ` match (p${i}:Prop) where ID(p${i})=${prop.keyId} `;
    propStrCreate += ` create (n)-[:HAS_PROPVAL {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(pv${i}:PropVal {value:'${
      prop.value
    }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_PROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(p${i}) `;
  });

  let childStrMatch = "";
  let childStrCreate = "";

  req.body.obj.node.childProps.map((dt, i) => {
    if (dt.value1.value == null) {
      childStrMatch += ` match (dt${i}:DataType) where ID(dt${i})=${dt.value2} `;
      childStrCreate += `create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i}:ChildProp:${
        req.body.selectedGraph
      } {key:'key',value:'${
        dt.value1
      }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_DATATYPE {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(dt${i}) `;
    } else {
      childStrMatch += `  match (cp${i}:ChildProp) where ID(cp${i})=${dt.value1.id} `;
      childStrCreate += ` create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i})`;
    }
  });
  let query =
    superStrMatch +
    labelStrMatch +
    propStrMatch +
    childStrMatch +
    labelStrCreate +
    propStrCreate +
    childStrCreate;

  console.log(query);
  // //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

api.post("/createSystemRootNode", async (req, res) => {


  let configNodeId = req.body.obj.configNodeId;
  let parentNodeId = req.body.obj.parentNodeId;

  let created = prop.getTimeStamp();

  let labelStrMatch = ` match (configNode) where ID(configNode)=${configNodeId} `;
  let parentStrMatch = ` match (parent) where ID(parent)=${parentNodeId} `;

  let labelStrCreate = ` create (parent)<-[:HAS_PARENT]-(n:${req.body.obj.node.labels[0]}:${
    req.body.obj.node.labels[1]
  } {guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_CONFIG {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(configNode) `;

  let propStrMatch = "";
  let propStrCreate = "";

  req.body.obj.node.props.map((prop, i) => {
    propStrMatch += ` match (p${i}) where ID(p${i})=${prop.keyId} `;
    propStrCreate += ` create (n)-[:HAS_PROPVAL {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(pv${i}:PropVal {value:'${
      prop.value
    }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_PROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(p${i}) `;
  });

  let childStrMatch = "";
  let childStrCreate = "";

  req.body.obj.node.childProps.map((dt, i) => {
    if (dt.value1.value == null) {
      childStrMatch += ` match (dt${i}:DataType) where ID(dt${i})=${dt.value2} `;
      childStrCreate += `create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i}:ChildProp:${
        req.body.selectedGraph
      } {key:'key',value:'${
        dt.value1
      }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_DATATYPE {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(dt${i}) `;
    } else {
      childStrMatch += `  match (cp${i}:ChildProp) where ID(cp${i})=${dt.value1.id} `;
      childStrCreate += ` create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i})`;
    }
  });
  let query =
    labelStrMatch +
    parentStrMatch +
    propStrMatch +
    childStrMatch +
    labelStrCreate +
    propStrCreate +
    childStrCreate;
  console.log(query);
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});

api.post("/createSystemSubNodeRel", async (req, res) => {
  console.log(req.body);
  let dir1 = "";
  let dir2 = "";
  if (req.body.direction == "to") {
    dir1 = `-`;
    dir2 = "->";
  } else {
    dir1 = `<-`;
    dir2 = "-";
  }
  let configNodeId = req.body.obj.configNodeId;
  let created = prop.getTimeStamp();

  let superStrMatch = ` match (m) where id(m)=${req.body.obj.node.id} `;

  let labelStrMatch = ` match (configNode) where ID(configNode)=${configNodeId} `;

  let parentStrMatch = ` match (parent) where ID(parent)=${req.body.obj.parentNodeId} `;


  let labelStrCreate = ` 
  
  create (m)${dir1}[:${
    req.body.obj.rel.type
  } {guid:'${v4()}', created: '${created}', updated:'${created}'}]${dir2}(n:${
    req.body.obj.node.labels[0]
  }:${
    req.body.obj.node.labels[1]
  } {guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_CONFIG {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(configNode) `;

  let parentStrCreate = ` create (n)-[:HAS_PARENT]->(parent) `

  let propStrMatch = "";
  let propStrCreate = "";

  req.body.obj.node.props.map((prop, i) => {
    propStrMatch += ` match (p${i}) where ID(p${i})=${prop.keyId} `;
    propStrCreate += ` create (n)-[:HAS_PROPVAL {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(pv${i}:PropVal {value:'${
      prop.value
    }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_PROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(p${i}) `;
  });

  let childStrMatch = "";
  let childStrCreate = "";

  req.body.obj.node.childProps.map((dt, i) => {
    if (dt.value1.value == null) {
      childStrMatch += ` match (dt${i}:DataType) where ID(dt${i})=${dt.value2} `;
      childStrCreate += `create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i}:ChildProp:${
        req.body.selectedGraph
      } {key:'key',value:'${
        dt.value1
      }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_DATATYPE {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(dt${i}) `;
    } else {
      childStrMatch += `  match (cp${i}:ChildProp) where ID(cp${i})=${dt.value1.id} `;
      childStrCreate += ` create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i})`;
    }
  });
  let query =
    superStrMatch +
    parentStrMatch + 
    labelStrMatch +
    propStrMatch +
    childStrMatch +
    labelStrCreate +
    parentStrCreate +
    propStrCreate +
    childStrCreate;

  console.log(query);
  // //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});



api.post("/createInfoDataSubNodeRel", async (req, res) => {
  console.log(req.body);
  let dir1 = "";
  let dir2 = "";
  if (req.body.direction == "to") {
    dir1 = `-`;
    dir2 = "->";
  } else {
    dir1 = `<-`;
    dir2 = "-";
  }
  let configNodeId = req.body.obj.configNodeId;
  let created = prop.getTimeStamp();

  let superStrMatch = ` match (m) where id(m)=${req.body.obj.node.id} `;

  let labelStrMatch = ` match (configNode) where ID(configNode)=${configNodeId} `;

  let parentStrMatch = ` match (parent) where ID(parent)=${req.body.obj.parentNodeId} `;



  let relNodeMatch = '';
  let relNodeCreate = '';

  req.body.obj.relss.map((rel, i) => {
    relNodeMatch += ` match (r${i}) where ID(r${i})=${rel.optionId} `;
    relNodeCreate += ` create (n)-[:${rel.relType}]->(r${i}) `;
  })

  let labelStrCreate = ` 
  
  create (m)${dir1}[:${
    req.body.obj.rel.type
  } {guid:'${v4()}', created: '${created}', updated:'${created}'}]${dir2}(n:${
    req.body.obj.node.labels[0]
  }:${
    req.body.obj.node.labels[1]
  } {guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_CONFIG {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(configNode) `;

  let parentStrCreate = ` create (n)-[:HAS_PARENT]->(parent) `

  let propStrMatch = "";
  let propStrCreate = "";

  req.body.obj.node.props.map((prop, i) => {
    propStrMatch += ` match (p${i}) where ID(p${i})=${prop.keyId} `;
    propStrCreate += ` create (n)-[:HAS_PROPVAL {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(pv${i}:PropVal {value:'${
      prop.value
    }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_PROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(p${i}) `;
  });

  let childStrMatch = "";
  let childStrCreate = "";

  req.body.obj.node.childProps.map((dt, i) => {
    if (dt.value1.value == null) {
      childStrMatch += ` match (dt${i}:DataType) where ID(dt${i})=${dt.value2} `;
      childStrCreate += `create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i}:ChildProp:${
        req.body.selectedGraph
      } {key:'key',value:'${
        dt.value1
      }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_DATATYPE {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(dt${i}) `;
    } else {
      childStrMatch += `  match (cp${i}:ChildProp) where ID(cp${i})=${dt.value1.id} `;
      childStrCreate += ` create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i})`;
    }
  });
  let query =
    superStrMatch +
    parentStrMatch + 
    labelStrMatch +
    relNodeMatch +
    propStrMatch +
    childStrMatch +
    labelStrCreate +
    parentStrCreate +
    propStrCreate +
    childStrCreate +
    relNodeCreate;

  console.log(query);
  // //
  let response = await prop.apiCall(query);
  let result = response.res;
  res.send(result);
});




// updateNode
api.post("/updateNode", async (req, res) => {
  let query =
    "Match (a) where id(a)=$id SET a +={ title: $title, updated:$updated} with {title: $title, type: $type, id: $id, updated: $updated} as obj RETURN collect(distinct obj) as node";

  let queryObject = {
    id: parseInt(req.body.id),
    title: req.body.title,
    updated: prop.getTimeStamp(),
    type: req.body.type,
  };
  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0].get(0)[0];
  res.send(result);
});

// updateConfigNode
api.post("/updateConfigNode", async (req, res) => {
  let query =
    "Match (a) where id(a)=$id SET a +={ key: $key, value: $value, updated:$updated} RETURN a";

  let queryObject = {
    id: parseInt(req.body.node.id),
    key: req.body.node.props[0].key,
    updated: prop.getTimeStamp(),
    value: req.body.node.props[0].value,
  };
  let response = await prop.apiCall(query, queryObject);
  let result = response.res.records[0];
  console.log(result);
  res.send(result);
});

api.post("/updateAsidNode", async (req, res) => {
  console.log(req.body);

  let label = `Match (a) where id(a)=${req.body.node.id} `;

  let propStrMatch = "";
  let propStrSet = "";

  req.body.node.props.map((propData, i) => {
    propStrMatch += ` match (pv${i}) where id(pv${i})=${propData.valueId} `;
    propStrSet += ` SET pv${i} +={value: '${
      propData.value
    }', updated:'${prop.getTimeStamp()}'} `;
  });

  let childPropStrMatch = "";
  let childPropStrSet = "";

  req.body.node.childProps.map((propData, i) => {
    childPropStrMatch += ` match (cp${i}) where id(cp${i})=${propData.keyId} `;
    childPropStrSet += ` SET cp${i} +={value: '${
      propData.key
    }', updated:'${prop.getTimeStamp()}'} `;
  });

  query =
    label +
    propStrMatch +
    childPropStrMatch +
    propStrSet +
    childPropStrSet +
    ` REMOVE a:${req.body.node.oldLabel} SET a:${req.body.node.title}`;

  console.log(query);
  let response = await prop.apiCall(query);
  let result = response.res.records[0];
  console.log(result);
  res.send(result);
});

api.post("/updateAsidChildProp", async (req, res) => {
  console.log(req.body);
  let created = prop.getTimeStamp();

  let childStrMatch = `Match (n) where id(n)=${req.body.node.node.id} `;
  let childStrCreate = "";

  req.body.node.node.childProps.map((dt, i) => {
    if (dt.value1.value == null) {
      childStrMatch += ` match (dt${i}:DataType) where ID(dt${i})=${dt.value2} `;
      childStrCreate += `create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i}:ChildProp:${
        req.body.node.selectedGraph
      } {key:'key',value:'${
        dt.value1
      }', guid:'${v4()}', created: '${created}', updated:'${created}'})-[:HAS_DATATYPE {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(dt${i}) `;
    } else {
      childStrMatch += `  match (cp${i}:ChildProp) where ID(cp${i})=${dt.value1.id} `;
      childStrCreate += ` create (n)-[:HAS_CHILDPROP {guid:'${v4()}', created: '${created}', updated:'${created}'}]->(cp${i})`;
    }
  });

  query = childStrMatch + childStrCreate;

  let response = await prop.apiCall(query);
  let result = response.res.records[0];
  console.log(result);
  res.send(result);
});

// deleteNode

api.post("/deleteNode", async (req, res) => {
  let query = "MATCH (a)<-[]-(b) where id(a)=$id return b";
  let queryObject = { id: parseInt(req.body.id) };

  let response = await prop.apiCall(query, queryObject);
  // Get first result in array
  let result = response.res.records[0];

  if (result != null) {
    return res
      .status(403)
      .send({ message: "Noden har relation(er) till sig." });
  } else {
    let query =
      "MATCH (a) where id(a)=$id detach delete a return toString(id(a))";
    let queryObject = { id: parseInt(req.body.id) };

    const response = await prop.apiCall(query, queryObject);
    let result = JSON.parse(response.res.records[0].get(0)[0]);
    // Get first response in array
    try {
      return res.send({ result, message: "Noden är borttagen." });
    } catch (error) {
      console.error(error, "Ett fel har uppstått.");
    }
    // return res.send({data: result, message: "Noden är borttagen."})
  }
});

api.post("/deleteConfigNode", async (req, res) => {
  let query =
    "MATCH (a) where id(a)=$id detach delete a return toString(id(a))";
  let queryObject = { id: parseInt(req.body.id) };
  console.log(query);

  const response = await prop.apiCall(query, queryObject);
  let result = JSON.parse(response.res.records[0].get(0)[0]);

  // Get first response in array
  try {
    return res.send({ result, message: "Noden är borttagen." });
  } catch (error) {
    console.error(error, "Ett fel har uppstått.");
  }
});

api.post("/deleteAsidNode", async (req, res) => {
  console.log(req.body);
  let query = `match (a) where id(a)=${req.body.id} 

      //kontrollera om (a) är en parentnod -> om det är en parentnod = TA INTE BORT
      optional match (a)<-[]-(b)
      with collect (ID(b)) as chldnds,a
      
      //kontrollera om (a) har (PropVal)
      optional match (a)-[:HAS_PROPVAL]->(pv:PropVal)
      with collect(ID(pv)) as prpvls, chldnds,a

      
      with {deletenode:{childnodes:chldnds,propvals:prpvls}} as json

      RETURN apoc.convert.toJson(json)`;

  const deleteCheck = await prop.apiCall(query);
  let deleteCheckResult = JSON.parse(deleteCheck.res.records[0].get(0));
  // Get first response in array
  console.log(deleteCheckResult);
  if (deleteCheckResult.deletenode.childnodes.length == 0) {
    console.log("can be deleted");

    let nodStrMatch = `Match (node) where id(node)=${req.body.id} `;
    let nodStrDelete = ` detach delete node`;

    if (deleteCheckResult.deletenode.propvals.length > 0) {
      deleteCheckResult.deletenode.propvals.map((pv, i) => {
        nodStrMatch += ` match (proval${i}) where id(proval${i})=${pv} `;
        nodStrDelete += `, proval${i}`;
      });
    }
    query1 = nodStrMatch + nodStrDelete + ` return node`;
    console.log(query1);

    const deleteNode = await prop.apiCall(query1);
    let result1 = deleteNode.res.records;
    // Get first response in array

    try {
      return res.send({ result1, message: "Noden är borttagen." });
    } catch (error) {
      console.error(error, "Ett fel har uppstått.");
    }
  } else {
    return res
      .status(403)
      .send({ message: "Noden har relation(er) till sig." });
  }
});

api.post("/getSystemConfig", async (req, res) => {

  
  let query = `match (nc:Node:Config)
  optional match (nc)-[:HAS_PROP]->(nc_prop)-[:HAS_DATATYPE]->(nc_prop_dt:DataType)
  optional match (nc)-[:HAS_LABEL]->(nc_label)-[:HAS_DATATYPE]->(nc_label_dt:DataType)
  
  match (nsc:Node:SystemConfig)
  optional match (nsc)-[:HAS_PROP]->(nsc_prop)-[:HAS_DATATYPE]->(nsc_prop_dt:DataType)
  optional match (nsc)-[:HAS_LABEL]->(nsc_label)-[:HAS_DATATYPE]->(nsc_label_dt:DataType)
  with collect(distinct(
          {id:ID(nc_prop),
                  key:nc_prop.key,
                  value:nc_prop_dt.key})) +
                  collect(   distinct(     
                  {id:ID(nsc_prop),
                  key:nsc_prop.key,
                  value:nsc_prop_dt.key})) as prprts
                  
              ,collect(distinct(
          {id:ID(nc_label),
                  key:nc_label.key,
                  value:nc_label_dt.key})) +
                  collect(  distinct(         
                  {id:ID(nsc_label),
                  key:nsc_label.key,
                  value:nsc_label_dt.key})) as lbls
 
  RETURN apoc.convert.toJson({
        systemConfig:{
              props:[val in prprts where val.key is not null],
              labels:[val in lbls where val.key is not null]}
              }) as obj `;

  let response = await prop.apiCall(query);
  let result = JSON.parse(response.res.records[0].get(0));
  res.send(result);
});

api.get("/", (req, res) => {
  res.send("Welcome to home page");
});

const PORT = process.env.PORT || 8080;
api.listen(PORT, () => console.log(`Server started on port ${PORT}`));
