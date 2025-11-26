"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EmailPreferences {
  newsletter: boolean;
  notifications: boolean;
  marketing: boolean;
}

interface NotificationsTabProps {
  preferences: EmailPreferences;
  onPreferencesChange: (preferences: EmailPreferences) => void;
  onSave: () => void;
}

export default function NotificationsTab({ 
  preferences, 
  onPreferencesChange, 
  onSave 
}: NotificationsTabProps) {
  return (
    <Card className="bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Email Preferences</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your email notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Newsletter</Label>
            <p className="text-sm text-gray-500">
              Receive updates about new features and announcements
            </p>
          </div>
          <Switch
            checked={preferences.newsletter}
            onCheckedChange={(checked: boolean) =>
              onPreferencesChange({ ...preferences, newsletter: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications</Label>
            <p className="text-sm text-gray-500">
              Receive email notifications about your account activity
            </p>
          </div>
          <Switch
            checked={preferences.notifications}
            onCheckedChange={(checked: boolean) =>
              onPreferencesChange({ ...preferences, notifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Emails</Label>
            <p className="text-sm text-gray-500">
              Receive promotional offers and marketing content
            </p>
          </div>
          <Switch
            checked={preferences.marketing}
            onCheckedChange={(checked: boolean) =>
              onPreferencesChange({ ...preferences, marketing: checked })
            }
          />
        </div>

        <Button
          onClick={onSave}
          className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
