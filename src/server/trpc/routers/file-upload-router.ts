import { authedProcedure, createTRPCRouter } from "@/server/trpc/init";
import {
  type PreSignedUploadRequest,
  preSignedUploadRequestSchema,
  uploadConfigs,
  type UploadConfigKey,
} from "@/types/upload-type";
import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/utils/env";
import { generateFileName, validateFiles } from "@/lib/file-upload/helpers";

export const BUCKET_NAME = env.AWS_S3_BUCKET_NAME;
export const s3Client = new S3Client({
  region: env.AWS_S3_REGION_NAME,
  credentials: {
    accessKeyId: env.AWS_S3_IAM_ACCESS_ID,
    secretAccessKey: env.AWS_S3_IAM_SECRET_ACCESS_KEY,
  },
});

function getPutObjectCommandParams({
  file,
  type,
  userId,
}: PreSignedUploadRequest & { userId: string }): PutObjectCommandInput {
  const config = uploadConfigs[type];

  if (!config) {
    throw new Error(`Invalid upload type: ${type}`);
  }

  return {
    Bucket: BUCKET_NAME,
    ContentType: file.mimeType,
    Key: `${config.folder}/${generateFileName(file.mimeType)}`,
    Metadata: { userId },
  };
}

async function getPreSignedUrl({
  file,
  type,
  userId,
}: PreSignedUploadRequest & { userId: string }) {
  const params = getPutObjectCommandParams({ file, type, userId });
  const command = new PutObjectCommand(params);

  const url = await getSignedUrl(s3Client, command, { expiresIn: 90 });

  return {
    key: params.Key as string,
    url,
  };
}

export const fileUploadRouter = createTRPCRouter({
  getPreSignedUrl: authedProcedure
    .input(preSignedUploadRequestSchema)
    .mutation(async ({ input, ctx }) => {
      const config = uploadConfigs[input.type as UploadConfigKey];

      if (input.files.length > config.maxFiles) {
        throw new Error(`Too many files. Max allowed is ${config.maxFiles}`);
      }

      validateFiles(input.files, input.type as UploadConfigKey);

      return Promise.all(
        input.files.map((file) =>
          getPreSignedUrl({
            type: input.type as UploadConfigKey,
            file,
            userId: ctx.user.id,
          }),
        ),
      );
    }),
});
