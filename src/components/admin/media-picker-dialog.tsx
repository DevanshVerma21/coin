"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, Upload, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getMediaAssets, uploadMedia } from "@/actions/media";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { IMediaAsset } from "@/types";

interface MediaPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPickerDialog({ open, onClose, onSelect }: MediaPickerDialogProps) {
  const [assets, setAssets] = useState<IMediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const fetchAssets = useCallback(async (q?: string) => {
    setLoading(true);
    const result = await getMediaAssets(1, 48, q);
    setAssets(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) fetchAssets();
  }, [open, fetchAssets]);

  useEffect(() => {
    const timer = setTimeout(() => fetchAssets(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search, fetchAssets]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const result = await uploadMedia(fd);
    if (result.success && result.data) {
      toast.success("Image uploaded");
      setAssets((prev) => [result.data!, ...prev]);
      onSelect(result.data.url);
      onClose();
    } else {
      toast.error(result.error ?? "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle>Select from Media Vault</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images…"
              className="pl-9 h-9"
            />
          </div>
          <label>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload
              </span>
            </Button>
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm">No images found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Upload images using the button above</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {assets.map((asset) => (
                <button
                  key={asset._id}
                  type="button"
                  onClick={() => setSelected(asset.url === selected ? null : asset.url)}
                  className={cn(
                    "relative aspect-square rounded-lg border overflow-hidden group transition-all",
                    selected === asset.url
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-muted-foreground"
                  )}
                  title={asset.originalName}
                >
                  <Image
                    src={asset.url}
                    alt={asset.originalName}
                    fill
                    className="object-contain p-1"
                    sizes="100px"
                  />
                  {selected === asset.url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatFileSize(asset.size)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {selected ? "1 image selected" : "No selection"}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="gold" onClick={handleConfirm} disabled={!selected}>
              Use Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
