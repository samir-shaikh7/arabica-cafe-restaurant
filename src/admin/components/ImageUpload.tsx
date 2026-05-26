import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, X, Loader2, Link as LinkIcon, Check, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, bucket = "site2-assets", className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onChange(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (!tempUrl) return;
    if (!tempUrl.startsWith("http")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    onChange(tempUrl);
    setTempUrl("");
    setShowUrlInput(false);
  };

  if (value) {
    return (
      <div className={`admin-image-upload ${className}`}>
        <div className="admin-image-upload__preview">
          <img src={value} alt="Uploaded preview" />
          <button type="button" onClick={() => onChange("")} className="admin-image-upload__remove" aria-label="Remove image">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-image-upload ${className}`}>
      {/* URL Input Row (matching reference design) */}
      <div className="admin-image-upload__url-row">
        <div className="admin-image-upload__url-input-wrap">
          <ImageIcon className="h-4 w-4" style={{ opacity: 0.4, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Paste URL or Upload..."
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
            className="admin-image-upload__url-input"
          />
          {tempUrl && (
            <button type="button" onClick={handleUrlSubmit} className="admin-image-upload__url-confirm">
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="admin-image-upload__upload-btn"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          <span>{uploading ? "Uploading..." : "Upload"}</span>
        </button>
      </div>

      <input type="file" ref={fileInputRef} onChange={uploadImage} accept="image/*" className="hidden" style={{ display: "none" }} />
    </div>
  );
}
