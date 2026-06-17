"use client";

import React, { useState, useCallback, useTransition } from "react";
import Image from "next/image";
import { Upload, Search, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { uploadMedia, deleteMedia, getMediaAssets } from "@/actions/media";
import { formatFileSize, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { IMediaAsset, PaginationMeta } from "@/types";

interface MediaVaultProps {
  initialAssets: IMediaAsset[];
  meta: PaginationMeta;
}

export function MediaVault({ initialAssets, meta: initialMeta }: MediaVaultProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [meta, setMeta] = useState(initialMeta);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [, startTransition] = useTransition();
  const [selected, setSelected] = useState<IMediaAsset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchAssets = useCallback(
    (q?: string, page = 1) => {
      startTransition(async () => {
        const result = await getMediaAssets(page, 24, q);
        setAssets(result.data);
        setMeta(result.meta);
      });
    },
    []
  );

  async function handleFiles(files: FileList) {
    setUploading(true);
    const uploaded: IMediaAsset[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadMedia(fd);
      if (result.success && result.data) {
        uploaded.push(result.data);
      } else {
        toast.error(`Failed: ${file.name} — ${result.error}`);
      }
    }

    if (uploaded.length > 0) {
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
      setAssets((prev) => [...uploaded, ...prev]);
      setMeta((m) => ({ ...m, total: m.total + uploaded.length }));
    }
    setUploading(false);
  }

  async function handleDelete(asset: IMediaAsset) {
    setDeletingId(asset._id);
    const result = await deleteMedia(asset._id);
    if (result.success) {
      toast.success("Image deleted");
      setAssets((prev) => prev.filter((a) => a._id !== asset._id));
      setMeta((m) => ({ ...m, total: m.total - 1 }));
      if (selected?._id === asset._id) setSelected(null);
    } else {
      toast.error(result.error ?? "Failed to delete");
    }
    setDeletingId(null);
  }

  return (
    <div className="flex gap-5 items-start">
      {/* Main panel */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Upload drop zone */}
        <label
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          )}
          <p className="text-sm font-medium">
            {uploading ? "Uploading…" : "Drop images here or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP · Max 10 MB each</p>
        </label>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              const q = e.target.value;
              setSearch(q);
              setTimeout(() => fetchAssets(q || undefined), 300);
            }}
            placeholder="Search images…"
            className="pl-9"
          />
        </div>

        {/* Grid */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border">
            <Upload className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No images yet. Upload some above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {assets.map((asset) => (
              <button
                key={asset._id}
                type="button"
                onClick={() =>
                  setSelected(selected?._id === asset._id ? null : asset)
                }
                className={cn(
                  "relative aspect-square rounded-lg border overflow-hidden group transition-all bg-muted/30",
                  selected?._id === asset._id
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrev}
              onClick={() => fetchAssets(search || undefined, meta.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {meta.page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNext}
              onClick={() => fetchAssets(search || undefined, meta.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Detail sidebar */}
      {selected && (
        <div className="w-60 shrink-0 hidden lg:block">
          <div className="rounded-xl border border-border bg-card overflow-hidden sticky top-4">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <p className="text-xs font-semibold">Details</p>
              <button
                onClick={() => setSelected(null)}
                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="aspect-square border-b border-border bg-muted/30">
              <Image
                src={selected.url}
                alt={selected.originalName}
                width={240}
                height={240}
                className="w-full h-full object-contain p-3"
              />
            </div>

            <div className="p-3 space-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Filename</p>
                <p className="font-medium truncate">{selected.originalName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{formatFileSize(selected.size)}</p>
                </div>
                {selected.width && (
                  <div>
                    <p className="text-muted-foreground">Dimensions</p>
                    <p className="font-medium">
                      {selected.width}×{selected.height}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">{formatDate(selected.createdAt)}</p>
              </div>
              {selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleDelete(selected)}
                disabled={deletingId === selected._id}
              >
                {deletingId === selected._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
