"use client";

import React, { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ICategory } from "@/types";

interface CategoryManagerProps {
  categories: ICategory[];
}

interface FormState {
  name: string;
  type: "coin" | "note";
  description: string;
}

const defaultForm: FormState = { name: "", type: "coin", description: "" };

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(cat: ICategory) {
    setEditing(cat);
    setForm({ name: cat.name, type: cat.type, description: cat.description ?? "" });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleSave() {
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("type", form.type);
    fd.set("description", form.description);

    startTransition(async () => {
      const result = editing
        ? await updateCategory(editing._id, fd)
        : await createCategory(fd);

      if (result.success) {
        toast.success(editing ? "Category updated" : "Category created");
        closeDialog();
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to save");
      }
    });
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const result = await deleteCategory(id);
    if (result.success) {
      toast.success("Category deleted");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete");
    }
    setDeleting(null);
  }

  const coins = categories.filter((c) => c.type === "coin");
  const notes = categories.filter((c) => c.type === "note");

  return (
    <>
      <div className="space-y-5">
        <Button onClick={openCreate} variant="gold" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Coin Categories", items: coins },
            { label: "Note Categories", items: notes },
          ].map(({ label, items }) => (
            <div key={label} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <h2 className="font-semibold text-sm">{label}</h2>
              </div>
              <div className="divide-y divide-border">
                {items.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                    No categories yet
                  </p>
                ) : (
                  items.map((cat) => (
                    <div key={cat._id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {cat.itemCount}
                      </Badge>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(cat)}
                          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          disabled={deleting === cat._id}
                          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          aria-label="Delete"
                        >
                          {deleting === cat._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Mughal Era"
              />
            </div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                value={form.type}
                onValueChange={(v: string) => setForm((f) => ({ ...f, type: v as "coin" | "note" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coin">Coin</SelectItem>
                  <SelectItem value="note">Banknote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Input
                id="cat-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={pending}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={pending || !form.name}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
