"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ListBlockProps {
  content: string;
  listStyle?: string;
  listItems?: string[];
  onChange: (data: { content: string; listStyle?: string; listItems?: string[] }) => void;
}

export default function ListBlock({ content, listStyle, listItems, onChange }: ListBlockProps) {
  const updateField = (field: string, value: any) => {
    onChange({
      content,
      listStyle,
      listItems,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>List Style</Label>
        <Select 
          value={listStyle || 'BULLET'} 
          onValueChange={(value) => updateField('listStyle', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BULLET">• Bullet Points</SelectItem>
            <SelectItem value="NUMBERED">1. Numbered List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>List Items (one per line)</Label>
        <Textarea
          placeholder="Item 1&#10;Item 2&#10;Item 3"
          rows={6}
          value={listItems?.join('\n') || ''}
          onChange={(e) => updateField('listItems', e.target.value.split('\n').filter(item => item.trim()))}
        />
      </div>

      <div className="space-y-2">
        <Label>Description/Context (optional)</Label>
        <Textarea
          placeholder="Additional context for this list..."
          rows={2}
          value={content}
          onChange={(e) => updateField('content', e.target.value)}
        />
      </div>
    </div>
  );
}