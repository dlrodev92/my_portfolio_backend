"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CodeBlockProps {
  content: string;
  language?: string;
  codeTitle?: string;
  onChange: (data: { content: string; language?: string; codeTitle?: string }) => void;
}

export default function CodeBlock({ content, language, codeTitle, onChange }: CodeBlockProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Programming Language</Label>
          <Input
            placeholder="javascript, python, html..."
            value={language || ''}
            onChange={(e) => onChange({ content, language: e.target.value, codeTitle })}
          />
        </div>
        <div className="space-y-2">
          <Label>Code Title (optional)</Label>
          <Input
            placeholder="app.js, main.py..."
            value={codeTitle || ''}
            onChange={(e) => onChange({ content, language, codeTitle: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Code Content</Label>
        <Textarea
          placeholder="Enter your code here..."
          rows={6}
          value={content}
          onChange={(e) => onChange({ content: e.target.value, language, codeTitle })}
          className="font-mono"
        />
      </div>
    </div>
  );
}