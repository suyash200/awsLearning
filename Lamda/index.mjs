import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { configDotenv } from "dotenv";
import util from 'util'
configDotenv()



const s3clinet = new S3({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
    },

})

const getCmd = new GetObjectCommand({ Bucket: 'onelinks', Key: 'logo.png' })

export const handler = async (evet, context, callback) => {

    console.log(util.inspect(evet.key1, { showHidden: false, depth: null }))
    const res = await getSignedUrl(s3clinet, getCmd, { expiresIn: 300 }, (err, data) => {
        if (err) {
            callback(err)
        } else {
            const link = data
            callback(null, data)
        }
    })


    return res
}

