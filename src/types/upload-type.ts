import z from "zod";

export const uploadConfigs = {
  avatar: {
    maxSizeMB: 1,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxFiles: 1,
    folder: "avatars",
  },
  //   more...
  //   cover: {
  //     maxSizeMB: 2,
  //     allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  //     maxFiles: 1,
  //     folder: "covers",
  //   },
} as const;

export type UploadType = keyof typeof uploadConfigs;

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
  type: UploadType;
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
