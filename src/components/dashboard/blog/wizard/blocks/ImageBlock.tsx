"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ImageBlockProps {
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageAlignment?: string;
  onChange: (data: { 
    content: string; 
    imageUrl?: string; 
    imageAlt?: string; 
    imageCaption?: string; 
    imageAlignment?: string;
  }) => void;
}

export default function ImageBlock({ 
  content, 
  imageUrl, 
  imageAlt, 
  imageCaption, 
  imageAlignment, 
  onChange 
}: ImageBlockProps) {
  const updateField = (field: string, value: string) => {
    onChange({
      content,
      imageUrl,
      imageAlt,
      imageCaption,
      imageAlignment,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Image URL *</Label>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl || ''}
            onChange={(e) => updateField('imageUrl', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Alt Text *</Label>
          <Input
            placeholder="Description for accessibility"
            value={imageAlt || ''}
            onChange={(e) => updateField('imageAlt', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Caption (optional)</Label>
          <Input
            placeholder="Image caption"
            value={imageCaption || ''}
            onChange={(e) => updateField('imageCaption', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Alignment</Label>
          <Select 
            value={imageAlignment || 'center'} 
            onValueChange={(value) => updateField('imageAlignment', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description/Content</Label>
        <Textarea
          placeholder="Describe this image or add additional context..."
          rows={3}
          value={content}
          onChange={(e) => updateField('content', e.target.value)}
        />
      </div>
    </div>
  );
}