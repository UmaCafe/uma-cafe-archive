import AWS from 'aws-sdk';

export function createClient(): AWS.S3 {
	const creds = new AWS.FileSystemCredentials('s3_credentials.json');
	AWS.config.credentials = creds;
	const endpoint = new AWS.Endpoint('s3.us-west-004.backblazeb2.com');
	return new AWS.S3({ endpoint });
}

export const CONTENT_BUCKET = 'uma-cafe-content';

export async function uploadObject(
	fileName: string,
	body: AWS.S3.Body,
	contentType?: string
): Promise<AWS.S3.PutObjectOutput> {
	const s3 = createClient();
	return new Promise((res, rej) => {
		s3.putObject(
			{ Bucket: CONTENT_BUCKET, Key: fileName, Body: body, ContentType: contentType },
			(err, data) => {
				if (err) {
					rej(err);
				} else {
					res(data);
				}
			}
		);
	});
}

export async function getObject(fileName: string): Promise<AWS.S3.GetObjectOutput> {
	const s3 = createClient();
	const res = await s3.getObject({ Bucket: CONTENT_BUCKET, Key: fileName }).promise();
	return res;
}

export async function listObjects(folderName: string): Promise<AWS.S3.ObjectList> {
	const s3 = createClient();
	const res = await s3.listObjects({ Bucket: CONTENT_BUCKET, Prefix: folderName }).promise();
	return res.Contents;
}

export async function deleteObject(fileName: string): Promise<AWS.S3.DeleteObjectOutput> {
	const s3 = createClient();
	const res = await s3.deleteObject({ Bucket: CONTENT_BUCKET, Key: fileName }).promise();
	return res;
}
