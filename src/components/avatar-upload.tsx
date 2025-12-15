"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFileUpload } from "@/hooks/use-file-upload";
import { resolveImageUrl } from "@/lib/file-upload/helpers";
import { toast } from "sonner";
import { uploadConfigs } from "@/types/upload-type";
import { authClient } from "@/lib/auth/client";

type Props = {
  initialImage?: string | null; // storage key
  name: string;
};

export default function AvatarUpload({ initialImage, name }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined); // resolved URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // blob

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles } = useFileUpload();

  // sync initial image (key → url)
  useEffect(() => {
    if (!initialImage) {
      setAvatarUrl(undefined);
      return;
    }

    setAvatarUrl(resolveImageUrl(initialImage, "key"));
  }, [initialImage]);

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setIsUploading(true);

    try {
      const { results } = await uploadFiles([file], "avatar");
      const uploadedKey = results[0]?.key;
      if (!uploadedKey) throw new Error("Upload returned no key");

      const res = await authClient.updateUser({ image: uploadedKey });
      if (!res?.data?.status) throw new Error("Failed to update user");

      setAvatarUrl(resolveImageUrl(uploadedKey, "key"));
      setPreviewUrl(null);

      toast.success("Avatar updated");
    } catch (err) {
      console.error(err);
      setPreviewUrl(null);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const imageSrc = previewUrl
    ? resolveImageUrl(previewUrl, "blob")
    : avatarUrl
      ? resolveImageUrl(avatarUrl, "url")
      : undefined;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="relative group disabled:cursor-not-allowed"
      >
        <Avatar className="h-32 w-32">
          <AvatarImage src={imageSrc} alt={name} />
          <AvatarFallback className="text-xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div
          className={[
            "absolute inset-0 rounded-full flex items-center justify-center transition",
            isUploading
              ? "bg-black/40 opacity-100"
              : "bg-black/40 opacity-0 group-hover:opacity-100",
          ].join(" ")}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Pen className="h-5 w-5 text-white" />
          )}
        </div>
      </button>

      <p className="text-xs text-zinc-500">
        JPG, PNG • Max {uploadConfigs.avatar.maxSizeMB} MB
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
