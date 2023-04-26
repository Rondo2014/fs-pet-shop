import http from "node:http";
import fs from "node:fs";

http
  .createServer((req, res) => {
    // if GET to /pets, return pets

    if (req.method === "GET" && req.url === "/pets") {
      fs.readFile("pets.json", "utf-8", (err, str) => {
        if (err) {
          res.statusCode = 500;
          res.end();
          return;
        }

        const pets = JSON.parse(str);

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(pets));
        res.end();
      });
    } else if (req.method === "GET" && req.url.startsWith("/pets")) {
      const urlParts = req.url.split("/");
      const index = parseInt(urlParts[urlParts.length - 1]);

      fs.readFile("pets.json", "utf-8", (err, str) => {
        if (err) {
          res.statusCode = 500;
          res.end();
          return;
        }

        const pets = JSON.parse(str);

        if (index < 0 || isNaN(index) || index >= pets.length) {
          res.statusCode = 404;
          res.end("Not Found");
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(pets[index]));
        res.end();
      });
    }
  })
  .listen(3000);
// read pets file and return results
