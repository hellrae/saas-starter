import Chance from "chance";
import {
  type InputFile,
  uploadConfigs,
  type UploadConfigKey,
} from "@/types/upload-type";
import { env } from "@/lib/utils/env";

const chance = new Chance();

export function generateFileName(mimeType: string): string {
  const randomWords = Array.from({ length: 3 }, () => chance.word()).join("-");
  const uniqueId = chance.hash({ length: 6 });
  const dateString = new Date().toISOString().replace(/[:.]/g, "-");
  const fileExtension = mimeType.split("/")[1] ?? "bin";

  return `${randomWords}-${uniqueId}-${dateString}.${fileExtension}`;
}

export function validateFile(file: InputFile, type: UploadConfigKey): void {
  const config = uploadConfigs[type];

  if (!config) throw new Error(`Invalid upload type: ${type}`);

  if (file.size > config.maxSizeMB * 1024 * 1024) {
    throw new Error(`File too large. Max size is ${config.maxSizeMB}MB`);
  }

  if (
    !config.allowedTypes.includes(
      file.mimeType as (typeof config.allowedTypes)[number],
    )
  ) {
    throw new Error(
      `Invalid file type. Allowed: ${config.allowedTypes.join(", ")}`,
    );
  }
}

export function validateFiles(files: InputFile[], type: UploadConfigKey): void {
  const config = uploadConfigs[type];

  if (files.length > config.maxFiles) {
    throw new Error(`Too many files. Max allowed is ${config.maxFiles}`);
  }

  for (const file of files) validateFile(file, type);
}

type ImageSourceType = "key" | "url" | "blob";

export function resolveImageUrl(
  src?: string | undefined,
  type: ImageSourceType = "key",
): string | undefined {
  if (!src) return undefined;

  switch (type) {
    case "blob":
      return src;

    case "url":
      return src;

    case "key": {
      const normalizedKey = src.startsWith("/") ? src.slice(1) : src;

      return `${env.NEXT_PUBLIC_ASSETS_SERVING_URL}/${normalizedKey}`;
    }

    default:
      return undefined;
  }
}
