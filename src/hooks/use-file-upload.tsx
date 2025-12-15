import { useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { uploadConfigs, type UploadConfigKey } from "@/types/upload-type";

export interface UploadProgress {
  filename: string;
  key: string;
  progress: number;
  status:
    | "pending"
    | "uploading"
    | "completed"
    | "error"
    | "cancelled"
    | "paused";
  error?: string;
  uploadedBytes?: number;
  totalBytes?: number;
  speed?: number; // bytes per second
  eta?: number; // seconds remaining
}

interface UploadOptions {
  onProgress?: (progress: UploadProgress[]) => void;
  onFileProgress?: (filename: string, progress: number) => void;
  onValidationError?: (errors: ValidationError[]) => void;
}

interface UploadResult {
  filename: string;
  key: string;
  status: "completed" | "error" | "cancelled";
  error?: string;
}

interface ValidationError {
  filename: string;
  error: string;
}

interface ActiveUpload {
  xhr: XMLHttpRequest;
  file: File;
  key: string;
  startTime: number;
  lastProgressTime: number;
  lastProgressBytes: number;
}

export function useFileUpload() {
  const getUploadUrlMutation = trpc.fileUpload.getPreSignedUrl.useMutation();
  const activeUploadsRef = useRef<Map<string, ActiveUpload>>(new Map());
  const uploadQueueRef = useRef<
    Array<{ file: File; key: string; url: string }>
  >([]);
  const progressMapRef = useRef<Map<string, UploadProgress>>(new Map());

  // Validate files against config
  const validateFiles = useCallback(
    (files: File[], type: UploadConfigKey): ValidationError[] => {
      const config = uploadConfigs[type];
      const errors: ValidationError[] = [];

      if (!config) {
        errors.push({
          filename: "general",
          error: `Invalid upload type: ${type}`,
        });
        return errors;
      }

      // Check file count
      if (files.length > config.maxFiles) {
        errors.push({
          filename: "general",
          error: `Maximum ${config.maxFiles} files allowed, got ${files.length}`,
        });
      }

      // Check for duplicates
      const filenames = new Set<string>();
      files.forEach((file) => {
        if (filenames.has(file.name)) {
          errors.push({ filename: file.name, error: "Duplicate file" });
        }
        filenames.add(file.name);
      });

      // Validate each file
      files.forEach((file) => {
        // Check file type
        if (
          !config.allowedTypes.includes(file.type as "image/jpeg" | "image/png")
        ) {
          errors.push({
            filename: file.name,
            error: `Invalid file type. Allowed: ${config.allowedTypes.join(", ")}`,
          });
        }

        // Check file size
        const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          errors.push({
            filename: file.name,
            error: `File too large. Maximum ${config.maxSizeMB}MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          });
        }

        if (file.size === 0) {
          errors.push({ filename: file.name, error: "File is empty" });
        }
      });

      return errors;
    },
    [],
  );

  // Calculate upload speed and ETA
  const calculateSpeedAndETA = useCallback(
    (
      filename: string,
      loadedBytes: number,
      totalBytes: number,
    ): { speed: number; eta: number } => {
      const upload = activeUploadsRef.current.get(filename);
      if (!upload) return { speed: 0, eta: 0 };

      const now = Date.now();
      const timeDiff = (now - upload.lastProgressTime) / 1000; // seconds
      const bytesDiff = loadedBytes - upload.lastProgressBytes;

      if (timeDiff > 0) {
        const speed = bytesDiff / timeDiff; // bytes per second
        const remainingBytes = totalBytes - loadedBytes;
        const eta = speed > 0 ? remainingBytes / speed : 0;

        // Update tracking
        upload.lastProgressTime = now;
        upload.lastProgressBytes = loadedBytes;

        return { speed, eta };
      }

      return { speed: 0, eta: 0 };
    },
    [],
  );

  // Update progress callback
  const updateProgress = useCallback((options?: UploadOptions) => {
    if (options?.onProgress) {
      options.onProgress(Array.from(progressMapRef.current.values()));
    }
  }, []);

  // Upload a single file
  const uploadFile = useCallback(
    (
      file: File,
      key: string,
      url: string,
      options?: UploadOptions,
      retryCount = 0,
    ): Promise<UploadResult> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const startTime = Date.now();

        const activeUpload: ActiveUpload = {
          xhr,
          file,
          key,
          startTime,
          lastProgressTime: startTime,
          lastProgressBytes: 0,
        };

        activeUploadsRef.current.set(file.name, activeUpload);

        progressMapRef.current.set(file.name, {
          filename: file.name,
          key,
          progress: 0,
          status: "uploading",
          uploadedBytes: 0,
          totalBytes: file.size,
        });
        updateProgress(options);

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            const { speed, eta } = calculateSpeedAndETA(
              file.name,
              e.loaded,
              e.total,
            );

            progressMapRef.current.set(file.name, {
              filename: file.name,
              key,
              progress: percent,
              status: "uploading",
              uploadedBytes: e.loaded,
              totalBytes: e.total,
              speed,
              eta,
            });

            if (options?.onFileProgress) {
              options.onFileProgress(file.name, percent);
            }

            updateProgress(options);
          }
        });

        xhr.addEventListener("load", () => {
          activeUploadsRef.current.delete(file.name);

          if (xhr.status >= 200 && xhr.status < 300) {
            progressMapRef.current.set(file.name, {
              filename: file.name,
              key,
              progress: 100,
              status: "completed",
              uploadedBytes: file.size,
              totalBytes: file.size,
            });
            updateProgress(options);

            resolve({
              filename: file.name,
              key,
              status: "completed",
            });
          } else {
            const errorMsg = `Upload failed with status ${xhr.status}`;

            // Retry logic (max 3 retries)
            if (retryCount < 3) {
              console.log(
                `Retrying upload for ${file.name}, attempt ${retryCount + 1}`,
              );
              setTimeout(() => {
                uploadFile(file, key, url, options, retryCount + 1)
                  .then(resolve)
                  .catch(reject);
              }, Math.pow(2, retryCount) * 1000); // Exponential backoff
            } else {
              progressMapRef.current.set(file.name, {
                filename: file.name,
                key,
                progress: progressMapRef.current.get(file.name)?.progress || 0,
                status: "error",
                error: errorMsg,
              });
              updateProgress(options);
              reject(new Error(errorMsg));
            }
          }
        });

        xhr.addEventListener("error", () => {
          activeUploadsRef.current.delete(file.name);
          const errorMsg = "Network error during upload";

          // Retry on network error
          if (retryCount < 3) {
            console.log(
              `Retrying upload for ${file.name} after error, attempt ${retryCount + 1}`,
            );
            setTimeout(() => {
              uploadFile(file, key, url, options, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, Math.pow(2, retryCount) * 1000);
          } else {
            progressMapRef.current.set(file.name, {
              filename: file.name,
              key,
              progress: progressMapRef.current.get(file.name)?.progress || 0,
              status: "error",
              error: errorMsg,
            });
            updateProgress(options);
            reject(new Error(errorMsg));
          }
        });

        xhr.addEventListener("abort", () => {
          activeUploadsRef.current.delete(file.name);
          progressMapRef.current.set(file.name, {
            filename: file.name,
            key,
            progress: progressMapRef.current.get(file.name)?.progress || 0,
            status: "cancelled",
            error: "Upload cancelled",
          });
          updateProgress(options);

          resolve({
            filename: file.name,
            key,
            status: "cancelled",
          });
        });

        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    },
    [calculateSpeedAndETA, updateProgress],
  );

  // Process upload queue with concurrency limit
  const processQueue = useCallback(
    async (
      concurrency: number,
      options?: UploadOptions,
    ): Promise<UploadResult[]> => {
      const results: UploadResult[] = [];
      const executing: Promise<void>[] = [];

      for (const item of uploadQueueRef.current) {
        const promise = uploadFile(item.file, item.key, item.url, options).then(
          (result) => {
            results.push(result);
          },
          (error) => {
            results.push({
              filename: item.file.name,
              key: item.key,
              status: "error",
              error: error.message,
            });
          },
        );

        executing.push(promise);

        if (executing.length >= concurrency) {
          await Promise.race(executing);
          executing.splice(
            executing.findIndex((p) => p === promise),
            1,
          );
        }
      }

      await Promise.all(executing);
      return results;
    },
    [uploadFile],
  );

  // Main upload function
  const uploadFiles = async (
    files: File[],
    type: UploadConfigKey,
    options?: UploadOptions,
  ) => {
    // Validate files
    const validationErrors = validateFiles(files, type);
    if (validationErrors.length > 0) {
      if (options?.onValidationError) {
        options.onValidationError(validationErrors);
      }
      throw new Error(
        `Validation failed: ${validationErrors.map((e) => e.error).join(", ")}`,
      );
    }

    const config = uploadConfigs[type];

    try {
      // Get presigned URLs for all files
      const urlData = await getUploadUrlMutation.mutateAsync({
        type,
        files: files.map((f) => ({
          filename: f.name,
          mimeType: f.type,
          size: f.size,
        })),
      });

      // Map files to their corresponding keys and URLs
      const fileUploadMap = files.map((file, index) => ({
        file,
        key: urlData[index].key,
        url: urlData[index].url,
      }));

      // Initialize progress tracking
      progressMapRef.current.clear();
      fileUploadMap.forEach(({ file, key }) => {
        progressMapRef.current.set(file.name, {
          filename: file.name,
          key,
          progress: 0,
          status: "pending",
          uploadedBytes: 0,
          totalBytes: file.size,
        });
      });
      updateProgress(options);

      // Add to queue
      uploadQueueRef.current = fileUploadMap;

      // Process queue with concurrency limit
      const results = await processQueue(config.concurrency, options);

      return {
        results,
        cancelAll: () => {
          activeUploadsRef.current.forEach((upload) => {
            upload.xhr.abort();
          });
          activeUploadsRef.current.clear();
        },
        cancelFile: (filename: string) => {
          const upload = activeUploadsRef.current.get(filename);
          if (upload) {
            upload.xhr.abort();
            activeUploadsRef.current.delete(filename);
          }
        },
        pauseFile: (filename: string) => {
          const upload = activeUploadsRef.current.get(filename);
          if (upload) {
            upload.xhr.abort();
            const progress = progressMapRef.current.get(filename);
            if (progress) {
              progressMapRef.current.set(filename, {
                ...progress,
                status: "paused",
              });
              updateProgress(options);
            }
          }
        },
      };
    } catch (error) {
      // Cleanup on error
      activeUploadsRef.current.forEach((upload) => {
        upload.xhr.abort();
      });
      activeUploadsRef.current.clear();
      throw error;
    }
  };

  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    activeUploadsRef.current.forEach((upload) => {
      upload.xhr.abort();
    });
    activeUploadsRef.current.clear();
    progressMapRef.current.clear();
    uploadQueueRef.current = [];
  }, []);

  return {
    uploadFiles,
    cleanup,
    validateFiles,
  };
}
