"use client";

import React, { useState, useTransition, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ImageIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { createItem, updateItem } from "@/actions/items";
import type { IItem, ICategory, IProvenanceEntry } from "@/types";

// Lazy-load the media picker — only pulled in when admin clicks "From Vault"
const MediaPickerDialog = lazy(() =>
  import("@/components/admin/media-picker-dialog").then((m) => ({
    default: m.MediaPickerDialog,
  }))
);

interface ItemFormProps {
  item?: IItem;
  categories: ICategory[];
  mode: "create" | "edit";
}

type MediaTarget = "front" | "back" | "extra0" | "extra1";

export function ItemForm({ item, categories, mode }: ItemFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pickerTarget, setPickerTarget] = useState<MediaTarget | null>(null);

  // Images
  const [frontImage, setFrontImage] = useState(item?.frontImage ?? "");
  const [backImage, setBackImage] = useState(item?.backImage ?? "");
  const [extra0, setExtra0] = useState(item?.additionalImages?.[0] ?? "");
  const [extra1, setExtra1] = useState(item?.additionalImages?.[1] ?? "");

  // Selects as strings (no Radix Select to avoid edge cases)
  const [type, setType] = useState(item?.type ?? "coin");
  const [rarity, setRarity] = useState(item?.rarity ?? "");
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [sold, setSold] = useState(item?.sold ?? false);
  const [selectedCats, setSelectedCats] = useState<string[]>(
    (item?.categories ?? []).map(String)
  );
  const [provenance, setProvenance] = useState<IProvenanceEntry[]>(
    item?.provenance ?? []
  );

  const filteredCats = categories.filter((c) => c.type === type);

  function toggleCat(id: string) {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleMediaSelect(url: string) {
    if (pickerTarget === "front") setFrontImage(url);
    else if (pickerTarget === "back") setBackImage(url);
    else if (pickerTarget === "extra0") setExtra0(url);
    else if (pickerTarget === "extra1") setExtra1(url);
    setPickerTarget(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!frontImage) {
      toast.error("Front image is required.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    fd.set("type", type);
    fd.set("featured", String(featured));
    fd.set("sold", String(sold));
    fd.set("frontImage", frontImage);
    fd.set("backImage", backImage);
    fd.delete("categories");
    selectedCats.forEach((id) => fd.append("categories", id));
    fd.delete("additionalImages");
    [extra0, extra1].filter(Boolean).forEach((u) => fd.append("additionalImages", u));
    if (rarity) fd.set("rarity", rarity);
    fd.set(
      "provenance",
      JSON.stringify(provenance.filter((p) => p.period && p.description))
    );

    startTransition(async () => {
      const result =
        mode === "edit" && item
          ? await updateItem(item._id, fd)
          : await createItem(fd);
      if (result.success) {
        toast.success(mode === "edit" ? "Item updated!" : "Item created!");
        router.push("/admin/items");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to save item.");
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left: main fields */}
          <div className="xl:col-span-2 space-y-5">

            {/* ── Basic Info ── */}
            <Card title="Basic Information">
              <div className="space-y-4">
                <Field label="Title *">
                  <Input name="title" defaultValue={item?.title} placeholder="e.g. 1835 British India Gold Mohur" required />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Type *">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as "coin" | "note")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="coin">Coin</option>
                      <option value="note">Banknote</option>
                    </select>
                  </Field>
                  <Field label="Year *">
                    <Input name="year" defaultValue={item?.year} placeholder="1835" required />
                  </Field>
                </div>

                <Field label="Price (₹) *">
                  <Input name="price" type="number" min="0" step="1" defaultValue={item?.price} placeholder="0" required />
                </Field>

                <Field label="Description *">
                  <Textarea name="description" defaultValue={item?.description} placeholder="Brief description shown on cards and curator note…" rows={4} required />
                </Field>
              </div>
            </Card>

            {/* ── Images ── */}
            <Card title="Images">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { label: "Front *", key: "front" as MediaTarget, val: frontImage },
                    { label: "Back", key: "back" as MediaTarget, val: backImage },
                    { label: "Detail 1", key: "extra0" as MediaTarget, val: extra0 },
                    { label: "Detail 2", key: "extra1" as MediaTarget, val: extra1 },
                  ] as const
                ).map(({ label, key, val }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <button
                      type="button"
                      onClick={() => setPickerTarget(key)}
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-1 bg-muted/20 overflow-hidden"
                    >
                      {val ? (
                        <Image src={val} alt={label} width={120} height={120} className="w-full h-full object-contain p-1" />
                      ) : (
                        <>
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">From Vault</span>
                        </>
                      )}
                    </button>
                    {val && (
                      <button
                        type="button"
                        onClick={() => {
                          if (key === "front") setFrontImage("");
                          else if (key === "back") setBackImage("");
                          else if (key === "extra0") setExtra0("");
                          else setExtra1("");
                        }}
                        className="text-[10px] text-center text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Upload images in <a href="/admin/media" className="underline text-primary">Media Vault</a> first, then select them here.
              </p>
            </Card>

            {/* ── Archival Specs ── */}
            <Card title="Archival Details (Optional)">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Denomination">
                  <Input name="denomination" defaultValue={item?.denomination} placeholder="e.g. One Mohur" />
                </Field>
                <Field label="Composition / Series">
                  <Input name="composition" defaultValue={item?.composition} placeholder="e.g. 0.917 Gold (22K)" />
                </Field>
                <Field label="Weight">
                  <Input name="weight" defaultValue={item?.weight} placeholder="e.g. 11.66 Grams" />
                </Field>
                <Field label="Mint / Issuing Authority">
                  <Input name="mint" defaultValue={item?.mint} placeholder="e.g. Calcutta Mint" />
                </Field>
                <Field label="Diameter / Dimensions">
                  <Input name="diameter" defaultValue={item?.diameter} placeholder="e.g. 26.2 mm" />
                </Field>
                <Field label="Rarity">
                  <select
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">— None —</option>
                    <option value="R">R — Rare</option>
                    <option value="RR">RR — Very Rare</option>
                    <option value="RRR">RRR — Extremely Rare</option>
                    <option value="RRRR">RRRR — Unique</option>
                  </select>
                </Field>
                <Field label="NGC / PMG Grade">
                  <Input name="grade" defaultValue={item?.grade} placeholder="e.g. MS-64" />
                </Field>
                <Field label="Strike / Condition">
                  <Input name="gradeType" defaultValue={item?.gradeType} placeholder="e.g. Proof-Like" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Historical Context (optional long text)">
                  <Textarea
                    name="historicalContext"
                    defaultValue={item?.historicalContext}
                    placeholder="Detailed historical narrative. Use double blank line for paragraphs."
                    rows={5}
                  />
                </Field>
              </div>
            </Card>

            {/* ── Provenance ── */}
            <Card
              title="Provenance Timeline"
              action={
                <button
                  type="button"
                  onClick={() => setProvenance((p) => [...p, { period: "", description: "" }])}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Entry
                </button>
              }
            >
              {provenance.length === 0 ? (
                <p className="text-xs text-muted-foreground">No entries yet.</p>
              ) : (
                <div className="space-y-2">
                  {provenance.map((p, i) => (
                    <div key={i} className="grid grid-cols-[120px_1fr_32px] gap-2 items-center">
                      <Input
                        value={p.period}
                        onChange={(e) =>
                          setProvenance((prev) =>
                            prev.map((x, j) => (j === i ? { ...x, period: e.target.value } : x))
                          )
                        }
                        placeholder="e.g. 1835–1840"
                        className="h-8 text-xs"
                      />
                      <Input
                        value={p.description}
                        onChange={(e) =>
                          setProvenance((prev) =>
                            prev.map((x, j) => (j === i ? { ...x, description: e.target.value } : x))
                          )
                        }
                        placeholder="e.g. Struck at Calcutta Mint…"
                        className="h-8 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setProvenance((prev) => prev.filter((_, j) => j !== i))}
                        className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <Card title="Publish">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Featured</Label>
                    <p className="text-xs text-muted-foreground">Show on homepage</p>
                  </div>
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                </div>
                {featured && (
                  <Field label="Featured Until">
                    <Input
                      name="featuredUntil"
                      type="date"
                      defaultValue={
                        item?.featuredUntil
                          ? new Date(item.featuredUntil).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </Field>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sold</Label>
                    <p className="text-xs text-muted-foreground">Mark unavailable</p>
                  </div>
                  <Switch checked={sold} onCheckedChange={setSold} />
                </div>
              </div>
            </Card>

            {filteredCats.length > 0 && (
              <Card title="Categories">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredCats.map((cat) => (
                    <div key={cat._id} className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${cat._id}`}
                        checked={selectedCats.includes(cat._id)}
                        onCheckedChange={() => toggleCat(cat._id)}
                      />
                      <label htmlFor={`cat-${cat._id}`} className="text-sm cursor-pointer">
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={pending || !frontImage}
                style={{
                  background: "linear-gradient(135deg,#735c00,#d4af37)",
                  color: "#fff",
                }}
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {mode === "edit" ? "Update Item" : "Create Item"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/items")}
                disabled={pending}
              >
                Cancel
              </Button>
              {mode === "edit" && item?.slug && (
                <a
                  href={`/${item.type === "coin" ? "coins" : "notes"}/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-9 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Preview ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </form>

      {pickerTarget !== null && (
        <Suspense fallback={null}>
          <MediaPickerDialog
            open={true}
            onClose={() => setPickerTarget(null)}
            onSelect={handleMediaSelect}
          />
        </Suspense>
      )}
    </>
  );
}

/* ── Tiny layout helpers ─────────────────────────────────── */
function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
