import { S3 } from "@aws-sdk/client-s3";
import { configDotenv } from "dotenv";

configDotenv();

const s3client = new S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
});

