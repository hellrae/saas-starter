import z from "zod";

export const uploadConfigs = {
  avatar: {
    maxSizeMB: 1,
    allowedTypes: ["image/jpeg", "image/png"], // only jpeg + png
    maxFiles: 1,
    concurrency: 3,
    folder: "temp-posts",
  },
  // add more types here...
} as const;

export type UploadConfigKey = keyof typeof uploadConfigs;
export type UploadConfig = (typeof uploadConfigs)[UploadConfigKey];

export const preSignedUploadRequestSchema = z.object({
  type: z.string(),
  files: z.array(
    z.object({
      filename: z.string(),
      mimeType: z.string(),
      size: z.number().positive(),
    }),
  ),
});

export type PreSignedUploadRequest = {
  type: UploadConfigKey;
  file: {
    filename: string;
    mimeType: string;
  };
};

export type InputFile = {
  filename: string;
  mimeType: string;
  size: number;
};
