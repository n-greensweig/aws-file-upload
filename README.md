# Full Stack React

## Setup

Create an account for AWS. Open the IAM dashboard and select "Users" on the left. Create a new user. Select "Attach policies directly" but do not select anything. We will add permissions at the bucket level.

Next, search for S3 on the AWS web console. Create a bucket and give it the following policy. Make sure to replace the user and bucket with YOUR arns.


## Bucket Policies

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Statement1",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::YOUR_USER"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::YOUR_BUCKET/*"
		},
		{
			"Sid": "Statement2",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::YOUR_USER"
			},
			"Action": "s3:PutObject",
			"Resource": "arn:aws:s3:::YOUR_BUCKET/*"
		}
	]
}
```

### `.env`

```
AWS_REGION=
AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
AWS_BUCKET=
```

### Setup your database

Create a database and table following the `database.sql` file.

### Start the server

```
npm install
npm run server
npm run client
```

## `npm` Libraries Required for File Upload

> NOTE: These have already been installed on this project.

`dotenv` is used to keep keys as enviornment variables. `@aws-sdk/client-s3` is a library for interacting with S3 buckets. `express-fileupload` allows for `req.files` to make file upload easier. `browser-image-resizer` is a client side library to resize images before sending to the server. If you're displaying the images on the web, it's good practice to resize and compress the images to increase load times. 

```
npm install dotenv
npm install @aws-sdk/client-s3
npm install express-fileupload
npm install browser-image-resizer
```



