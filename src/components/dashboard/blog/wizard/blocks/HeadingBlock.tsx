"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeadingBlockProps {
  content: string;
  level?: number;
  onChange: (data: { content: string; level?: number }) => void;
}

export default function HeadingBlock({ content, level, onChange }: HeadingBlockProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Heading Level</Label>
        <Select 
          value={level?.toString() || '1'} 
          onValueChange={(value) => onChange({ content, level: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 - Main Title</SelectItem>
            <SelectItem value="2">H2 - Section</SelectItem>
            <SelectItem value="3">H3 - Subsection</SelectItem>
            <SelectItem value="4">H4 - Minor Heading</SelectItem>
            <SelectItem value="5">H5 - Small Heading</SelectItem>
            <SelectItem value="6">H6 - Tiny Heading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Heading Text</Label>
        <Input
          placeholder="Enter your heading..."
          value={content}
          onChange={(e) => onChange({ content: e.target.value, level })}
        />
      </div>
    </div>
  );
}