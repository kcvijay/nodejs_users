const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

// Reading files from templates
const allUsers = fs.readFileSync(`${__dirname}/templates/home.html`, "utf-8");
const userCard = fs.readFileSync(
  `${__dirname}/templates/user-card.html`,
  "utf-8"
);
const singleUserCard = fs.readFileSync(
  `${__dirname}/templates/user-page.html`,
  "utf-8"
);

// Reading JSON data
const data = fs.readFileSync(`${__dirname}/data/users.json`, "utf-8");
const dataObj = JSON.parse(data);

// Creating the server.
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/allusers") {
    // For homepage
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(userCard, el))
      .join("");
    const output = allUsers.replace("{%USERS%}", cardsHtml);
    res.end(output);
    //
  } else if (pathname === "/users") {
    //Fo single user page
    res.writeHead(200, { "Content-type": "text/html" });
    // ID starts from '1' in JSON so, getting the index 0
    const user = dataObj[Number(query.id) - 1];
    const output = replaceTemplate(singleUserCard, user);
    res.end(output);
    //
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h2>Error 404. Page not found!");
  }
});

// Listening the server.
server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running at port 8000.");
});
