const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

const queryvariant = "SELECT * FROM t_pages WHERE nome = ?";
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
  "SELECT JSON_ARRAYAGG(nome) AS namelist FROM t_pages ORDER BY nome DESC";
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

const querycats = "SELECT id, category FROM t_category ORDER BY category DESC";
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

  db.query("DELETE FROM t_category WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send(result);
  });
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

// Route for creating the post
app.post("/api/create", (req, res) => {
  //const id = req.body.id;
  const title = req.body.title;
  const text = req.body.text;

  db.query(
    "INSERT INTO t_pages (nome, contenuto) VALUES (?,?)",
    [title, text],
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
  var text = "Backend Website: <p>/api/getdata</p>";
  text += "<p>/api/getdatafrompage/:id</p>";
  text += "<p>/api/getdatapages</p>";
  text += "<p>/api/getdatacats</p>";
  text += "<p>/api/createcategory/:name</p>";
  text += "<p>/api/deletecategory/:id</p>";
  text += "<p>/api/editcategory/:id~:nome</p>";
  text += "<p>/api/create (POST)</p>";

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
