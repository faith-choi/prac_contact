const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const port = 8080;

//DB 세팅
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.once("open", function () {
  console.log("DB 연결 성공!");
});
db.on("erre", function () {
  console.log("DB ERROR : ", err);
});

//other 세팅
app.set("view engine", "ejs"); //ejs를 사용하기 위해 express의 view engine에 ejs를 set하는 코드
app.use(express.static(__dirname + "/contacts"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
/* app.get("/hello", (req, res) => {
  res.render("hello", { name: req.query.nameQuery });//query를 통해 이름을 받는코드. 모든 query는 req.query에 저장됨
});
app.get("/hello/:nameparam", (req, res) => {
  res.render("hello", { name: req.params.nameParam });//parameter를 통해 이름을 받는 코드. 콜론으로 시작되는 route는 해당 부분에 입력되는 route의 텍스트가 rerq.params에 저장됨.
}); */

//DB schema
const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
});
const Contact = mongoose.model("contact", contactSchema);

//Routes, Home
app.get("/", (req, res) => {
  res.redirect("/contacts");
});

//Contacts - index
app.get("/contacts", (req, res) => {
  Contact.find({}, (err, contacts) => {
    if (err) return res.json(err);
    res.render("contacts/index", {
      contacts: contacts,
    });
  });
});

//Contacts - NEW
app.get("/contacts/new", (req, res) => {
  res.render("contacts/new");
});

//Contacts - create
app.post("/contacts", (req, res) => {
  Contact.create(req.body, (err, contact) => {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

//보여주는 코드(show)
app.get("/contacts/:id", (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) return res.json(err);
    res.render("contacts/show.ejs", { contact: contact });
  });
});

//수정하는 코드
app.get("/contacts/:id/edit", (req, res) => {
  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) return res.json(err);
    res.render("contacts/edit.ejs", { contact: contact });
  });
});
//수정코드
app.put("/contacts/:id", (req, res) => {
  Contact.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, contactSchema) => {
      if (err) return res.json(err);
      res.redirect("/contacts/" + req.params.id);
    }
  );
});

//지우는 코드(destroy)
app.delete("/contacts/:id", (req, res) => {
  Contact.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return "/contacts";
  });
});

//PORT 세팅 / //1
app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다!");
});
