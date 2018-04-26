const express = require('express');
const google_trends = require("google-trends-api");
const querystring = require('querystring');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
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
                  let res_json = timeline[timeline.length-1].value;
                  res.send(res_json)
              })
      }


  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
