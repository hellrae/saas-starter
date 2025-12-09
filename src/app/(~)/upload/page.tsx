"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { trpc } from "@/lib/trpc/client";
import { uploadConfigs, type UploadType } from "@/types/upload-type";
import { resolveImageUrl } from "@/lib/file-upload/helpers";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const getUploadUrlMutation = trpc.fileUpload.getPreSignedUrl.useMutation();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setSelectedFiles(Array.from(files));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFiles.length) return;

    setUploading(true);

    try {
      const presigns = await getUploadUrlMutation.mutateAsync({
        type: "avatar" as UploadType,
        files: selectedFiles.map((f) => ({
          filename: f.name,
          size: f.size,
          mimeType: f.type,
        })),
      });

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const { url, key } = presigns[i];

        const uploadResp = await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResp.ok) {
          console.error("Upload failed for", file.name);
          continue;
        }

        console.log("Uploaded:", file.name, resolveImageUrl(key));
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md shadow-md rounded-xl p-6 space-y-6"
      >
        <div className="border-2 border-dashed rounded-xl p-6 text-center transition relative">
          <input
            type="file"
            multiple={uploadConfigs["avatar"].maxFiles > 1}
            onChange={handleChange}
            className="hidden"
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            className="cursor-pointer size-full absolute inset-0 flex items-center justify-center"
          >
            {selectedFiles.length
              ? `${selectedFiles.length} file(s) selected`
              : "Click to choose files"}
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <ul className="text-sm space-y-2 pl-2 list-none">
            {selectedFiles.map((file) => (
              <li key={file.name} className="flex flex-col gap-y-0.5">
                <span>{file.name}</span>
                <span className="text-muted-foreground text-xs">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!selectedFiles.length || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
}
