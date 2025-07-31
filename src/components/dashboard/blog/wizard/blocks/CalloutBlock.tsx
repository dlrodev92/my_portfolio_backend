"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalloutBlockProps {
  content: string;
  calloutVariant?: string;
  calloutTitle?: string;
  onChange: (data: { content: string; calloutVariant?: string; calloutTitle?: string }) => void;
}

export default function CalloutBlock({ content, calloutVariant, calloutTitle, onChange }: CalloutBlockProps) {
  const updateField = (field: string, value: string) => {
    onChange({
      content,
      calloutVariant,
      calloutTitle,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Callout Type</Label>
          <Select 
            value={calloutVariant || 'INFO'} 
            onValueChange={(value) => updateField('calloutVariant', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFO">ℹ️ Info</SelectItem>
              <SelectItem value="WARNING">⚠️ Warning</SelectItem>
              <SelectItem value="TIP">💡 Tip</SelectItem>
              <SelectItem value="ERROR">❌ Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Title (optional)</Label>
          <Input
            placeholder="Callout title"
            value={calloutTitle || ''}
            onChange={(e) => updateField('calloutTitle', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Callout Content</Label>
        <Textarea
          placeholder="Enter your callout message..."
          rows={4}
          value={content}
          onChange={(e) => updateField('content', e.target.value)}
        />
      </div>
    </div>
  );
}