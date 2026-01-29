import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div
            className="flex flex-col items-center text-center space-y-2 animate-in fade-in-0 zoom-in-95 duration-500"
          >
            <ShieldX className="h-24 w-24 text-destructive" aria-hidden />
            <p className="text-8xl font-bold text-primary">403</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Forbidden
            </h1>
            <p className="text-muted-foreground">
              You don&apos;t have permission to access this resource.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-center gap-2">
          <Button asChild variant="default" size="lg">
            <Link href="/" className="flex items-center gap-2">
              <span>Back to Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span>Dashboard</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
