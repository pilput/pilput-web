"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface DangerZoneTabProps {
  onDeleteAccount: () => void;
}

export default function DangerZoneTab({ onDeleteAccount }: DangerZoneTabProps) {
  return (
    <Card className="bg-background/80 backdrop-blur-md border border-red-200/50 dark:border-red-800/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        <CardDescription className="text-muted-foreground">
          Irreversible and destructive actions for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-red-200 dark:border-red-800 p-4 bg-red-50 dark:bg-red-950/20">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            Delete Account
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={onDeleteAccount}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
