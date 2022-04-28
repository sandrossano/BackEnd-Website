const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const crypto = require("crypto");
var axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/api/getLinkedin", (req, res) => {
  var config = {
    method: "get",
    url:
      "https://cors-casillo-sap.herokuapp.com/https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn%3Ali%3Aorganization%3A11028533)&sortBy=LAST_MODIFIED&count=15&projection=(elements(displayImage~:playableStreams))",
    headers: {
      "X-Restli-Protocol-Version": "2.0.0",
      Authorization:
        "Bearer AQWIeVFGX2BN0v4dCCkOJVm-NSszrgXbERxVmsl0oQvteVEvrB5hMwnuOnrApIqoiX1qG_8rZfzxvikSdYJmvvIhCbS4BcvoD_kKbdtIvgrhKOxMPV5sSCPYLu1K0tZpgs43pMiNh3s8y835sc28t3ow8aYtzhNPju8pUqTNsU4UoUZqG-7jKDEhjdw2ft2d7G4MY8ujhroJxbn57A7Taem1ACyISzNoW9iTxwNswyRwr-J3bBD_MkQNelACArQtAh5_PrzTac4VXo4GnHLgoefbbNPirgFDsZyByDVba9bLtJCJLe2ZEXms4C2hRS4MMyYpZil9J0oMylp4NLKOGU3QgrRZcg",
      Cookie:
        'lidc="b=OB78:s=O:r=O:a=O:p=O:g=2420:u=261:x=1:i=1650971271:t=1650972899:v=2:sig=AQFQYt8TGnP70vVB7QsVykqmwVHD0RHv"; lidc="b=VB78:s=V:r=V:a=V:p=V:g=2807:u=262:x=1:i=1651160947:t=1651241791:v=2:sig=AQGN7sP_DX-gBfcho_SNwTjU6QuFzkpy"; bcookie="v=2&df6355d7-b807-4f5c-8c24-95582e3d375a"; lang=v=2&lang=en-us; li_gc=MTswOzE2NTA5NjMyODk7MjswMjGr3TkyJNvcnuf58Mko12ZsTugOc0scpV3Xu48wLugGAQ=='
    }
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      db.query(
        "INSERT INTO t_linkedin (`day`, `json_file`)" + " VALUES (?, ? )",
        [new Date().toISOString(), response.data],
        (err, result) => {
          if (err) {
            //console.log(err.sqlMessage);
            console.log(err);
          }
        }
      );

      //setdataLikedin(filtro(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/api/login", (req, res) => {
  const id = req.body.email;
  const password = crypto
    .createHash("md5")
    .update(req.body.password)
    .digest("hex");
  db.query(
    "SELECT * FROM t_users WHERE email = ? AND password = ? ",
    [id, password],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

const querydata = "SELECT * FROM t_pages";
// Route to get all posts
app.get("/api/getdata", (req, res) => {
  const id = req.params.id;
  db.query(querydata, id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

const queryvariant = "SELECT * FROM t_pages WHERE id = ? AND status = 0";
// Route to get all posts
app.get("/api/getdatafrompage/:id", (req, res) => {
  const id = req.params.id;
  db.query(queryvariant, id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

const querypages =
  "SELECT JSON_ARRAYAGG(nome) AS namelist FROM t_pages WHERE status = 0 ORDER BY nome DESC ";
// Route to get all posts
app.get("/api/getdatapages", (req, res) => {
  const id = req.params.id;
  db.query(querypages, id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

const querycats =
  "SELECT id, category FROM t_category WHERE status = 0 ORDER BY category DESC ";
// Route to get all posts
app.get("/api/getdatacats", (req, res) => {
  const id = req.params.id;
  db.query(querycats, id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/createcategory/:name", (req, res) => {
  //const id = req.body.id;
  const name = req.params.name;
  //const text = req.body.text;

  db.query(
    "INSERT INTO t_category (category) VALUES (?)",
    name,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    }
  );
});

app.get("/api/deletecategory/:id", (req, res) => {
  //const id = req.body.id;
  const id = req.params.id;
  //const text = req.body.text;

  db.query(
    "UPDATE t_category SET status = 1 WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    }
  );
});

app.get("/api/editcategory/:id~:nome", (req, res) => {
  //const id = req.body.id;
  const id = req.params.id;
  const nome = req.params.nome;

  db.query(
    "UPDATE t_category SET category = ? WHERE id = ?",
    [nome, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    }
  );
});

app.get("/api/getpagesfromcat/:id", (req, res) => {
  //const id = req.body.id;
  const id = req.params.id;
  //const text = req.body.text;

  db.query(
    "SELECT id, nome, contenuto FROM t_cat_pag_link INNER JOIN t_pages ON t_pages.id = t_cat_pag_link.id_pag WHERE id_cat = ? AND status = 0",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    }
  );
});

app.get("/api/createpage/:name~:idcat", (req, res) => {
  //const id = req.body.id;
  const name = req.params.name;
  const idcat = req.params.idcat;

  db.query("INSERT INTO t_pages (nome) VALUES (?)", name, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    //res.send(result);
    db.query(
      "INSERT INTO t_cat_pag_link (id_cat,id_pag) VALUES (?,?)",
      [idcat, result.insertId],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        res.send(result);
      }
    );
  });
});

app.get("/api/deletepage/:id", (req, res) => {
  //const id = req.body.id;
  const id = req.params.id;
  //const text = req.body.text;

  db.query("UPDATE t_pages SET status = 1 WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send(result);
  });
});

app.get("/api/editpage/:id~:nome", (req, res) => {
  //const id = req.body.id;
  const id = req.params.id;
  const nome = req.params.nome;

  db.query(
    "UPDATE t_pages SET nome = ? WHERE id = ?",
    [nome, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    }
  );
});

// Route for creating the post
app.post("/api/sendpage", (req, res) => {
  const id = req.body.id;
  const base64 = req.body.base64;
  const image = req.body.image;

  db.query(
    "UPDATE t_pages SET contenuto = ?, image = ? WHERE id = ?",
    [base64, image, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    }
  );
});

app.get("/", (req, res) => {
  var text = "Backend Website: <p>/api/login (POST)</p><p>/api/getdata</p>";
  text += "<p>/api/getdatafrompage/:id</p>";
  text += "<p>/api/getdatapages</p>";
  text += "<p>/api/getdatacats</p>";
  text += "<p>/api/getpagesfromcat/:id</p>";
  text += "<p>/api/createcategory/:name</p>";
  text += "<p>/api/deletecategory/:id</p>";
  text += "<p>/api/editcategory/:id~:nome</p>";
  text += "<p>/api/createpage/:name~:idcat</p>";
  text += "<p>/api/deletepage/:id</p>";
  text += "<p>/api/editpage/:id~:nome</p>";
  text += "<p>/api/sendpage (POST)</p>";
  text += "<p>/api/getLinkedin (SCHEDULE 1gg)</p>";

  /*text += "<p>/api/deletevariant/:report~:variant</p>";
  text += "<p>/api/createvariant/:report~:variant~:user~:json</p>";
  text += "<p>/api/login/:id~:psw</p>";
  text += "<p>/api/getusers</p>";
  text += "<p>/api/getroles</p>";
  text += "<p>/api/getroleslist</p>";
  text += "<p>/api/getapplist</p>";
  text += "<p>/api/deleteuser/:id</p>";
  text += "<p>/api/deleterole/:id</p>";
  text += '<p>/api/createuser/:id~:email~:psw~["Ruolo1","Ruolo3"]</p>';
  text += "<p>/api/createrole/:id~:email~:arrayroles</p>";
  text += '<p>/api/edituser/:id~:email~:psw~["Ruolo1","Ruolo3"]</p>';
  text += "<p>/api/editrole/:id~:email~:arrayroles</p>";
  */
  //text += '<p>/api/createlink_user/:id~["Ruolo1","Ruolo3"]';
  res.send(text);
});

app.listen(PORT, () => {
  console.log("Server is running on" + PORT);
});
