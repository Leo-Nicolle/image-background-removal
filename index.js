const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("promise-fs");
const uuid = require("uuid/v4");
const app = express();
// const SEGMENT_CMD = "python $1";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/segment", function(req, res) {
  console.log("ici");
  const image = req.body.image;
  const input = "face1.jpg";
  const output = `output/${uuid()}.png`;

  // write the image in a file
  fs.writeFile("/dev/null", image)
    .then(() => {
      const segmentation = spawn("python", ["seg.py", input, output]);

      segmentation.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      segmentation.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
      });

      segmentation.on("close", code => {
        if (code === 0) {
          res.sendFile(output, {
            root: __dirname,
            dotfiles: "deny",
            headers: {
              "x-timestamp": Date.now(),
              "x-sent": true
            }
          });
        } else {
          res.status(500).send("wrong segmentation");
        }
      });
    })
    .catch(error => {
      res.status(500).send("wrong image" + error);
    });
});
app.listen(3000, function() {
  console.log("Started on PORT 3000");
});
