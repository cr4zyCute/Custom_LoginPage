"use client";

import { useState } from "react";
import { updateEmailTemplate } from "@/actions/email-actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EmailEditor({ template }: { template: any }) {
  const [subject, setSubject] = useState(template.subject);
  const [htmlContent, setHtmlContent] = useState(template.htmlContent);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateEmailTemplate(template.id, { subject, htmlContent });
      router.refresh();
      router.push("/admin/emails");
    } catch (error) {
      console.error("Failed to save template", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Subject Line
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          HTML Content
        </label>
        <div className="relative">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
          />
          <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            HTML
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          You can use standard HTML tags for styling. Variables like <code>{"{{url}}"}</code> will be replaced dynamically.
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Template"}
        </Button>
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
