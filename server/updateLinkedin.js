const bearer = require("./bearer");
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
var axios = require("axios");

var config = {
  method: "get",
  url:
    "https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn%3Ali%3Aorganization%3A11028533)&sortBy=LAST_MODIFIED&count=15&projection=(elements(displayImage~:playableStreams))",
  headers: {
    "X-Restli-Protocol-Version": "2.0.0",
    Authorization: `Bearer ${bearer.bearer}`,
    Cookie:
      'lidc="b=OB78:s=O:r=O:a=O:p=O:g=2420:u=261:x=1:i=1650971271:t=1650972899:v=2:sig=AQFQYt8TGnP70vVB7QsVykqmwVHD0RHv"; lidc="b=VB78:s=V:r=V:a=V:p=V:g=2807:u=262:x=1:i=1651160947:t=1651241791:v=2:sig=AQGN7sP_DX-gBfcho_SNwTjU6QuFzkpy"; bcookie="v=2&df6355d7-b807-4f5c-8c24-95582e3d375a"; lang=v=2&lang=en-us; li_gc=MTswOzE2NTA5NjMyODk7MjswMjGr3TkyJNvcnuf58Mko12ZsTugOc0scpV3Xu48wLugGAQ=='
  }
};

axios(config)
  .then(function (response) {
    console.log(response.data);
    db.query("DELETE FROM t_linkedin", [], (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      //res.send(result);

      db.query(
        "INSERT INTO t_linkedin (`day`, `json_file`) VALUES (?, ? )",
        [new Date().toISOString(), JSON.stringify(response.data)],
        (err, result) => {
          if (err) {
            //res.send(err);
            //console.log(err.sqlMessage);
            console.log(err);
          } else {
            console.log(result);
          }
        }
      );
    });

    //setdataLikedin(filtro(response.data));
  })
  .catch(function (error) {
    //res.send(error);
    console.log(error);
  });
