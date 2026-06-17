import Link from "next/link";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-6">
        <Coins className="h-8 w-8 text-primary" />
      </div>
      <h1 className="font-serif text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-lg font-semibold text-foreground mb-2">Page Not Found</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        This item or page doesn&apos;t exist or may have been removed from the collection.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="gold">Back to Home</Button>
        </Link>
        <Link href="/coins">
          <Button variant="outline">Browse Coins</Button>
        </Link>
      </div>
    </div>
  );
}
