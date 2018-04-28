const express = require('express');
const google_trends = require("google-trends-api");
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
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


  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
