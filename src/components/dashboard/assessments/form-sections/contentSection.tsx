"use client";

import { UseFormReturn } from "react-hook-form";
import { AssessmentFormData, createAssessmentContentBlock } from "@/lib/schemas/assessment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, GripVertical, Type, Heading } from "lucide-react";

interface ContentSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export default function ContentSection({ form }: ContentSectionProps) {
  const { watch, setValue } = form;
  const contentBlocks = watch('contentBlocks') || [];

  const addContentBlock = (type: 'PARAGRAPH' | 'HEADING') => {
    const newBlock = createAssessmentContentBlock(
      type,
      '',
      contentBlocks.length,
      type === 'HEADING' ? { level: 2 } : {}
    );
    
    setValue('contentBlocks', [...contentBlocks, newBlock]);
  };

  const removeContentBlock = (index: number) => {
    const updatedBlocks = contentBlocks.filter((_, i) => i !== index);
    setValue('contentBlocks', updatedBlocks);
  };

  const updateContentBlock = (index: number, field: string, value: string | number) => {
    const updatedBlocks = contentBlocks.map((block, i) => 
      i === index ? { ...block, [field]: value } : block
    );
    setValue('contentBlocks', updatedBlocks);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= contentBlocks.length) return;

    const updatedBlocks = [...contentBlocks];
    [updatedBlocks[index], updatedBlocks[newIndex]] = [updatedBlocks[newIndex], updatedBlocks[index]];
    
    // Update order
    updatedBlocks.forEach((block, i) => {
      block.order = i;
    });
    
    setValue('contentBlocks', updatedBlocks);
  };

  return (
    <div className="space-y-6">
      {/* Add Block Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addContentBlock('PARAGRAPH')}
          className="gap-2"
        >
          <Type className="w-4 h-4" />
          Add Paragraph
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addContentBlock('HEADING')}
          className="gap-2"
        >
          <Heading className="w-4 h-4" />
          Add Heading
        </Button>
      </div>

      {/* Content Blocks */}
      {contentBlocks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No content blocks yet</p>
          <p className="text-sm">Click the buttons above to add paragraphs or headings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contentBlocks.map((block, index) => (
            <Card key={block.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Drag Handle & Move Buttons */}
                  <div className="flex flex-col gap-1 mt-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    <div className="flex flex-col">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === contentBlocks.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                  </div>

                  {/* Block Content */}
                  <div className="flex-1 space-y-3">
                    {/* Block Type & Level (for headings) */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <div className="flex items-center gap-2">
                          {block.type === 'PARAGRAPH' ? (
                            <Type className="w-4 h-4" />
                          ) : (
                            <Heading className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            {block.type === 'PARAGRAPH' ? 'Paragraph' : 'Heading'}
                          </span>
                        </div>
                      </div>

                      {block.type === 'HEADING' && (
                        <div className="w-24">
                          <Label className="text-xs text-muted-foreground">Level</Label>
                          <Select
                            value={String(block.level || 2)}
                            onValueChange={(value) => updateContentBlock(index, 'level', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">H1</SelectItem>
                              <SelectItem value="2">H2</SelectItem>
                              <SelectItem value="3">H3</SelectItem>
                              <SelectItem value="4">H4</SelectItem>
                              <SelectItem value="5">H5</SelectItem>
                              <SelectItem value="6">H6</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Content Input */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Content</Label>
                      <Textarea
                        placeholder={
                          block.type === 'PARAGRAPH'
                            ? "Write your paragraph content here..."
                            : "Write your heading text here..."
                        }
                        value={block.content}
                        onChange={(e) => updateContentBlock(index, 'content', e.target.value)}
                        rows={block.type === 'PARAGRAPH' ? 4 : 2}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContentBlock(index)}
                    className="text-destructive hover:text-destructive mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {contentBlocks.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {contentBlocks.length} content block{contentBlocks.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}