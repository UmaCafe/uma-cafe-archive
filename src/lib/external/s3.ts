import { config, Endpoint, FileSystemCredentials, S3 } from 'aws-sdk';

export function createClient(): S3 {
	const creds = new FileSystemCredentials('s3_credentials.json');
	config.credentials = creds;
	const endpoint = new Endpoint('s3.us-west-004.backblazeb2.com');
	return new S3({ endpoint });
}

export const CONTENT_BUCKET = 'uma-cafe-content';

export async function uploadObject(fileName: string, body: S3.Body): Promise<S3.PutObjectOutput> {
	const s3 = createClient();
	return new Promise((res, rej) => {
		s3.putObject({ Bucket: CONTENT_BUCKET, Key: fileName, Body: body }, (err, data) => {
			if (err) {
				rej(err);
			} else {
				res(data);
			}
		});
	});
}

export async function getObject(fileName: string): Promise<S3.GetObjectOutput> {
	const s3 = createClient();
	const res = await s3.getObject({ Bucket: CONTENT_BUCKET, Key: fileName }).promise();
	return res;
}

export async function listObjects(folderName: string): Promise<S3.ObjectList> {
	const s3 = createClient();
	const res = await s3.listObjects({ Bucket: CONTENT_BUCKET, Prefix: folderName }).promise();
	return res.Contents;
}
