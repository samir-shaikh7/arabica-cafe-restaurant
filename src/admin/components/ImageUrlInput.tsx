import { LinkIcon } from "lucide-react";

interface ImageUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUrlInput({ value, onChange, className = "" }: ImageUrlInputProps) {
  return (
    <div className={`admin-image-url-input ${className} space-y-4 w-full`}>
      <div className="flex items-center gap-3 w-full">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LinkIcon className="h-4 w-4 text-foreground/40" />
          </div>
          <input
            type="url"
            placeholder="Paste image URL here (https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>
      </div>
      
      {value && (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full max-h-[200px] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={(e) => {
              (e.target as HTMLImageElement).style.display = 'block';
            }}
          />
        </div>
      )}
    </div>
  );
}
