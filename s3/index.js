import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { error } from "console";
import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import formidable from "formidable";
import fs, { read } from "fs";
import {
  S3RequestPresigner,
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
configDotenv();

const s3client = new S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
});
const signer = new S3RequestPresigner({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
const params = {
  Key: "file.txt",
  Bucket: "tralawsbucket",
  Body: "sdfds",
};
const date = new Date();
const today = `${date.getDay()}:${date.getMonth()}:${date.getFullYear()}`;
app.post("/", async (req, res, next) => {
  const form = formidable({
    // uploadDir: "C:/Users/Suyash/programming/aws-trials/uploads",
    maxFileSize: 50 * 1024 * 1024,
    multiples: true,
  });

  form.parse(req);

  form.on("file", async (forms, file) => {
    console.log(file.filepath);

    const readStream = fs.createReadStream(file.filepath);

    await s3client
      .putObject(
        {
          Bucket: process.env.bucket,
          Body: readStream,
          Key: file.originalFilename,
          ACL: "public-read",
        },
        (err, data) => {
          if (err) {
            res.send("err in  uploading picture", err);
            res.status(500);
          }

          // const ur = `https://${process.env.bucket}.s3.ap-south-1.amazonaws.com/${file.originalFilename}`;
          // console.log(ur);
          res.status(200).send("upload sucessful");
        }
      )
      .then(() => {
        fs.rm(file.filepath, (err) => {
          if (err) {
            res.status(500).send("error in  uploading");
          }
        });
      });
  });
});
app.get("/get", async (req, res) => {
 
  const commd = new GetObjectCommand({ Bucket: "onelinks", Key: "logo.png" });

  const z = await getSignedUrl(s3client, commd, { expiresIn: 3 });
  res.status(200).send(z);
});
app.delete("/del", (req, res) => {
  s3client.deleteObject(
    { Bucket: "onelinks", Key: "logo.png" },
    (err, data) => {
      if (err) {
        res.status(500).send("error erasing the fuile");
      }
      res.status(200).send(data);
    }
  );
});
app.listen(4000, () => {
  console.log("helllow 4000");
});

// const run = async () => {

// };
// run();
