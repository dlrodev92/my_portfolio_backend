"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ParagraphBlockProps {
  content: string;
  paragraphStyle?: string;
  onChange: (data: { content: string; paragraphStyle?: string }) => void;
}

export default function ParagraphBlock({ content, paragraphStyle, onChange }: ParagraphBlockProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Paragraph Style</Label>
        <Select 
          value={paragraphStyle || 'normal'} 
          onValueChange={(value) => onChange({ content, paragraphStyle: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal Text</SelectItem>
            <SelectItem value="lead">Lead Paragraph (larger)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          placeholder="Enter your paragraph content..."
          rows={4}
          value={content}
          onChange={(e) => onChange({ content: e.target.value, paragraphStyle })}
        />
      </div>
    </div>
  );
}