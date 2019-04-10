const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const base64Img = require("base64-img");
const fs = require("promise-fs");
const uuid = require("uuid/v4");
const cors = require("cors");
const app = express();
const IJS = require("image-js");

// console.log(faceExtraction);
// const input = IJS.Image.load("face1.png").then(image => {
//   faceExtraction.faceDetect(image);
// });

// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//     json: { limit: "200mb", extended: true },
//     urlencoded: { limit: "200mb", extended: true }
//   })
// );
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(bodyParser.json());
app.use(cors());

app.post("/segment", function(req, res) {
  const inputName = uuid();
  const input = `input/${inputName}.png`;
  const output = `output/${uuid()}.png`;
  // write the image in a file
  base64Img.img(req.body.image, "input/", inputName, (err, filepath) => {
    if (err) {
      res.status(500).send("wrong image" + error);
      return;
    }
    const segmentation = spawn("python", ["seg.py", input, output]);

    segmentation.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    segmentation.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });

    segmentation.on("close", code => {
      if (code === 0) {
        fs.readFile(output)
          .then(image => {
            console.log(typeof image);
            console.log(image instanceof Buffer);

            const base64 = image.toString("base64");

            res.writeHead(200, {
              "Content-Type": "image/png",
              "Content-Length": base64.length
            });
            res.end(base64);
          })
          .catch(e => res.status(500).send("no output image" + e));
      } else {
        res.status(500).send("wrong segmentation");
      }
    });
  });
});
app.listen(3000, function() {
  console.log("Started on PORT 3000");
});
