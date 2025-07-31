"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VideoBlockProps {
  content: string;
  videoType?: string;
  videoId?: string;
  videoTitle?: string;
  onChange: (data: { 
    content: string; 
    videoType?: string; 
    videoId?: string; 
    videoTitle?: string;
  }) => void;
}

export default function VideoBlock({ content, videoType, videoId, videoTitle, onChange }: VideoBlockProps) {
  const updateField = (field: string, value: string) => {
    onChange({
      content,
      videoType,
      videoId,
      videoTitle,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Video Platform</Label>
          <Select 
            value={videoType || 'YOUTUBE'} 
            onValueChange={(value) => updateField('videoType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YOUTUBE">📺 YouTube</SelectItem>
              <SelectItem value="VIMEO">🎬 Vimeo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Video ID *</Label>
          <Input
            placeholder="dQw4w9WgXcQ (from URL)"
            value={videoId || ''}
            onChange={(e) => updateField('videoId', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {videoType === 'YOUTUBE' ? 'From youtube.com/watch?v=VIDEO_ID' : 'From vimeo.com/VIDEO_ID'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Video Title (optional)</Label>
        <Input
          placeholder="Video title"
          value={videoTitle || ''}
          onChange={(e) => updateField('videoTitle', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Description/Context</Label>
        <Textarea
          placeholder="Describe this video or add context..."
          rows={3}
          value={content}
          onChange={(e) => updateField('content', e.target.value)}
        />
      </div>
    </div>
  );
}