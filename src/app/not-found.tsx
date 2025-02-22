import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div
            className="flex flex-col items-center text-center space-y-2 animate-in fade-in-0 zoom-in-95 duration-500"
          >
            <p className="text-8xl font-bold text-primary">404</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Page Not Found
            </h1>
            <p className="text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
