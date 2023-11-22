module.exports = function (app, shopData) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // Query the database to get all the books
    // Execute the SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }

      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  app.get("/bargainbooks", function (req, res) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"; // Query to get books priced less than £20
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        let bargainBooksData = Object.assign({}, shopData, {
          bargainBooks: result,
        });
        res.render("bargainbooks.ejs", bargainBooksData);
      }
    });
  });

  app.get("/search-result", function (req, res) {
    // Get the search keyword from the request
    let keyword = req.query.keyword;

    // Basic search query
    let basicSearchQuery = "SELECT * FROM books WHERE name = ?";
    // Advanced search query
    let advancedSearchQuery = "SELECT * FROM books WHERE name LIKE ?";

    // Execute basic search
    db.query(basicSearchQuery, [keyword], (err, basicResult) => {
      if (err) {
        console.error(err.message);
        res.redirect("/");
      } else {
        // Execute advanced search
        db.query(
          advancedSearchQuery,
          ["%" + keyword + "%"],
          (err, advancedResult) => {
            if (err) {
              console.error(err.message);
              res.redirect("/");
            } else {
              // Combineing the results and render the template
              let shopDataData = {
                shopData: shopData,
                searchKeyword: keyword,
                basicSearchResult: basicResult,
                advancedSearchResult: advancedResult,
              };
              res.render("search-result.ejs", shopDataData);
            }
          }
        );
      }
    });
  });

  app.post("/registered", function (req, res) {
    // saving the data in database
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });

  app.post("/bookadded", function (req, res) {
    // saving the data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // executing sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This book is added to database, name: " +
            req.body.name +
            " price " +
            req.body.price
        );
      }
    });
  });
};
