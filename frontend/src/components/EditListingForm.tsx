import React, { useState } from 'react';
import { Category, Listing } from '../backend';
import { useUpdateListing, useDeleteListing } from '../hooks/useQueries';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, CheckCircle, Trash2 } from 'lucide-react';

interface EditListingFormProps {
  listing: Listing;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: Category.deal, label: 'Deal' },
  { value: Category.loot, label: 'Loot' },
  { value: Category.offer, label: 'Offer' },
  { value: Category.flashSale, label: 'Flash Sale' },
  { value: Category.quickSale, label: 'Quick Sale' },
  { value: Category.resell, label: 'Resell' },
];

function nsToDateTimeLocal(ns: bigint): { date: string; time: string } {
  const ms = Number(ns / BigInt(1_000_000));
  const d = new Date(ms);
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().slice(0, 5);
  return { date, time };
}

export default function EditListingForm({ listing, onSuccess }: EditListingFormProps) {
  const { pin } = useAdminAuth();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const [success, setSuccess] = useState(false);

  const existingExpiry = listing.expiryTimestamp != null ? nsToDateTimeLocal(listing.expiryTimestamp) : null;

  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description,
    originalPrice: String(listing.originalPrice),
    dealPrice: String(listing.dealPrice),
    category: listing.category,
    imageUrl: listing.imageUrl,
    stockQuantity: String(Number(listing.stockQuantity)),
    expiryDate: existingExpiry?.date ?? '',
    expiryTime: existingExpiry?.time ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsExpiry = form.category === Category.flashSale || form.category === Category.quickSale;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.originalPrice || isNaN(Number(form.originalPrice)) || Number(form.originalPrice) <= 0)
      errs.originalPrice = 'Valid original price required';
    if (!form.dealPrice || isNaN(Number(form.dealPrice)) || Number(form.dealPrice) <= 0)
      errs.dealPrice = 'Valid deal price required';
    if (!form.imageUrl.trim()) errs.imageUrl = 'Image URL is required';
    if (!form.stockQuantity || isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0)
      errs.stockQuantity = 'Valid stock quantity required';
    if (needsExpiry && !form.expiryDate) errs.expiryDate = 'Expiry date required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    let expiryTimestamp: bigint | null = null;
    if (needsExpiry && form.expiryDate) {
      const dateStr = form.expiryTime ? `${form.expiryDate}T${form.expiryTime}` : `${form.expiryDate}T23:59:59`;
      expiryTimestamp = BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
    }

    try {
      await updateListing.mutateAsync({
        id: listing.id,
        title: form.title.trim(),
        description: form.description.trim(),
        originalPrice: Number(form.originalPrice),
        dealPrice: Number(form.dealPrice),
        category: form.category,
        imageUrl: form.imageUrl.trim(),
        stockQuantity: BigInt(Math.floor(Number(form.stockQuantity))),
        expiryTimestamp,
        pin,
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSuccess?.(); }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteListing.mutateAsync({ id: listing.id, pin });
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  const field = (key: string) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 text-deal-neon bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          <span className="font-semibold text-sm">Listing updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label>Title *</Label>
          <Input value={form.title} {...field('title')} className="bg-deal-surface-2 border-border" />
          {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label>Description *</Label>
          <Textarea value={form.description} {...field('description')} className="bg-deal-surface-2 border-border resize-none" rows={3} />
          {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Original Price (₹) *</Label>
          <Input type="number" value={form.originalPrice} {...field('originalPrice')} className="bg-deal-surface-2 border-border" />
          {errors.originalPrice && <p className="text-destructive text-xs">{errors.originalPrice}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Deal Price (₹) *</Label>
          <Input type="number" value={form.dealPrice} {...field('dealPrice')} className="bg-deal-surface-2 border-border" />
          {errors.dealPrice && <p className="text-destructive text-xs">{errors.dealPrice}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as Category }))}>
            <SelectTrigger className="bg-deal-surface-2 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Stock Quantity *</Label>
          <Input type="number" value={form.stockQuantity} {...field('stockQuantity')} className="bg-deal-surface-2 border-border" />
          {errors.stockQuantity && <p className="text-destructive text-xs">{errors.stockQuantity}</p>}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label>Image URL *</Label>
          <Input value={form.imageUrl} {...field('imageUrl')} className="bg-deal-surface-2 border-border" />
          {errors.imageUrl && <p className="text-destructive text-xs">{errors.imageUrl}</p>}
        </div>

        {needsExpiry && (
          <>
            <div className="space-y-1.5">
              <Label>Expiry Date *</Label>
              <Input type="date" value={form.expiryDate} {...field('expiryDate')} className="bg-deal-surface-2 border-border" />
              {errors.expiryDate && <p className="text-destructive text-xs">{errors.expiryDate}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Time</Label>
              <Input type="time" value={form.expiryTime} {...field('expiryTime')} className="bg-deal-surface-2 border-border" />
            </div>
          </>
        )}
      </div>

      {(updateListing.isError || deleteListing.isError) && (
        <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
          Operation failed. Check your PIN or try again.
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={updateListing.isPending} className="flex-1 bg-primary text-primary-foreground font-bold">
          {updateListing.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" disabled={deleteListing.isPending} className="gap-2">
              {deleteListing.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{listing.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}
