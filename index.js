const express = require('express');
const google_trends = require("google-trends-api");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const key = fs.readFileSync("./keys/private.key", 'utf8');
const cert = fs.readFileSync("./keys/server.crt", 'utf8');
const http = require('http');
const https =require("https");
const tls = require("tls");
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = process.env.PORT || 8443;


let app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cors())

  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
      let q = req.query.q;
      if (q === undefined){
          console.log("no querystring");
          res.send("")
      }else{
          google_trends.interestOverTime({keyword: q})
              .then(function(results){
                  let json = JSON.parse(results);
                  let timeline = json.default.timelineData;
                  if (timeline.length > 0){
                      let res_json = timeline[timeline.length-1].value;
                      res.send(res_json);
                  }else{
                      res.send("")
                  }
                  console.log("handeled request for query : " + q.toString());
              })
      }


  });

const http_server = http.createServer(app);
const credentials = tls.createSecureContext({key: key, cert: cert});
const https_server = https.createServer(app, credentials);

//http_server.listen(HTTP_PORT);
//console.log(`HTTP listening on ${ HTTP_PORT }`);
https_server.listen(HTTPS_PORT);
console.log(`HTTPS listening on ${ HTTPS_PORT }`);