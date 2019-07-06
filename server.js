const exphbs = require("express-handlebars");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
//=============================================//

app.use(logger("dev"));
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.Promise = Promise;
const port = process.env.PORT || 3000

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



//---------------------------------------------------------------------------------------------//

app.get("/", function (req, res) {
  db.Article.find({ "saved": false }, function (error, data) {
    const dJson = {
      article: data
    };
    console.log(dJson);
    res.render("index", dJson);
  });
});


app.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com/section/science").then(function(response) {
    const $ = cheerio.load(response.data);
    $(".css-4jyr1y").each(function(i, element) {

      var result = {};

      result.link = $(this)
      .children("a")
      .attr("href");

      result.title = $(this)
      .children("a")
      .children("h2")
      .text()
      .trim();
      
      result.summary = $(this)
      .children("a")
      .children("p")
      .text();

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete!");
  });
});

app.get("/saved", function (req, res) {
  db.Article.find({ "saved": true }).populate("note").exec(function (error, articles) {
    const aJson = {
      article: articles
    };
    console.log(articles);
    res.render("saved", aJson);
  });
});

app.get("/clear", function (req, res) {
  db.Article.remove({ "saved": false })
    .exec(function (err, doc) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/");
      }
    });
});

app.get("/notes/delete/:id", function (req, res) {
  db.Note.findOneAndRemove({ "_id": req.params.id }).then(function (response) {
    res.redirect("/saved")
  }).catch(function (err) {
    res.json(err)
  });
})


app.post("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.send(doc);
      }
    });
});

app.post("/notes/save/:id", function (req, res) {
  console.log("body: " + req.body)
  console.log("Id: " + req.params.id)
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbnote) {
      res.json(dbnote);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/delete/:id", function (req, res) {
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.send(doc);
      }
    });
});


app.listen(port, function () {
  console.log("App running on port " + port);
});