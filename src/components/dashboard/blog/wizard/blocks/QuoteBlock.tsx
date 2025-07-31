"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuoteBlockProps {
  content: string;
  quoteAuthor?: string;
  onChange: (data: { content: string; quoteAuthor?: string }) => void;
}

export default function QuoteBlock({ content, quoteAuthor, onChange }: QuoteBlockProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Quote Text</Label>
        <Textarea
          placeholder="Enter the quote..."
          rows={4}
          value={content}
          onChange={(e) => onChange({ content: e.target.value, quoteAuthor })}
        />
      </div>

      <div className="space-y-2">
        <Label>Author (optional)</Label>
        <Input
          placeholder="Quote author"
          value={quoteAuthor || ''}
          onChange={(e) => onChange({ content, quoteAuthor: e.target.value })}
        />
      </div>
    </div>
  );
}