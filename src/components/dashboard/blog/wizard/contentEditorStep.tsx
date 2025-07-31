"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData, ContentBlockData, createContentBlock } from "@/lib/schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileText, Type, Edit3 } from "lucide-react";
import ParagraphBlock from "./blocks/ParagraphBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import CodeBlock from "./blocks/CodeBlock";
import ImageBlock from "./blocks/ImageBlock";
import CalloutBlock from "./blocks/CalloutBlock";
import QuoteBlock from "./blocks/QuoteBlock";
import ListBlock from "./blocks/ListBlock";
import VideoBlock from "./blocks/VideoBlock";

interface ContentEditorStepProps {
  form: UseFormReturn<BlogFormData>;
}

const blockTypes = [
  { value: 'PARAGRAPH', label: 'Paragraph', description: 'Regular text content', component: ParagraphBlock },
  { value: 'HEADING', label: 'Heading', description: 'Section heading', component: HeadingBlock },
  { value: 'CODE', label: 'Code', description: 'Code snippet', component: CodeBlock },
  { value: 'IMAGE', label: 'Image', description: 'Image with caption', component: ImageBlock },
  { value: 'CALLOUT', label: 'Callout', description: 'Important note', component: CalloutBlock },
  { value: 'QUOTE', label: 'Quote', description: 'Blockquote', component: QuoteBlock },
  { value: 'LIST', label: 'List', description: 'Bullet or numbered list', component: ListBlock },
  { value: 'VIDEO', label: 'Video', description: 'YouTube/Vimeo video', component: VideoBlock },
];

export default function ContentEditorStep({ form }: ContentEditorStepProps) {
  const contentBlocks = form.watch('contentBlocks') || [];
  const [selectedBlockType, setSelectedBlockType] = useState('PARAGRAPH');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [blockData, setBlockData] = useState<any>({ content: '' });

  // Calculate stats
  const totalWords = contentBlocks.reduce((count, block) => {
    return count + (block.content.trim().split(/\s+/).length || 0);
  }, 0);

  useEffect(() => {
    form.setValue('wordCount', totalWords);
    form.setValue('readTime', Math.max(1, Math.ceil(totalWords / 200)));
  }, [totalWords, form]);

  const resetForm = () => {
    setBlockData({ content: '' });
    setEditingIndex(null);
  };

  const addBlock = () => {
    if (!blockData.content.trim()) return;

    const newBlock = createContentBlock(
      selectedBlockType as ContentBlockData['type'],
      blockData.content.trim(),
      contentBlocks.length + 1,
      blockData
    );

    form.setValue('contentBlocks', [...contentBlocks, newBlock]);
    resetForm();
  };

  const updateBlock = (index: number) => {
    if (!blockData.content.trim()) return;

    const updated = [...contentBlocks];
    updated[index] = {
      ...updated[index],
      content: blockData.content,
      ...blockData
    };

    form.setValue('contentBlocks', updated);
    resetForm();
  };

  const editBlock = (index: number) => {
    const block = contentBlocks[index];
    setSelectedBlockType(block.type);
    setBlockData(block);
    setEditingIndex(index);
  };

  const deleteBlock = (index: number) => {
    const updated = contentBlocks
      .filter((_, i) => i !== index)
      .map((block, i) => ({ ...block, order: i + 1 }));
    form.setValue('contentBlocks', updated);
  };

  const renderBlockEditor = () => {
    const blockType = blockTypes.find(t => t.value === selectedBlockType);
    if (!blockType) return null;

    const BlockComponent = blockType.component;
    return (
      <BlockComponent
        {...blockData}
        onChange={setBlockData}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-title font-bold mb-2">Content Blocks</h2>
        <p className="text-muted-foreground">
          Create your blog content using different types of content blocks
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className="gap-2">
          <Type className="w-3 h-3" />
          {totalWords} words
        </Badge>
        <Badge variant="outline" className="gap-2">
          <FileText className="w-3 h-3" />
          ~{Math.max(1, Math.ceil(totalWords / 200))} min read
        </Badge>
        <Badge variant="secondary" className="gap-2">
          📝 {contentBlocks.length} blocks
        </Badge>
      </div>

      {/* Current Content Blocks */}
      {contentBlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Content Blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentBlocks.map((block, index) => (
              <div key={block.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <span className="text-xs font-medium text-muted-foreground mt-1">
                  #{index + 1}
                </span>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {blockTypes.find(t => t.value === block.type)?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {block.content}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editBlock(index)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBlock(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Block Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingIndex !== null ? 'Edit Block' : 'Add New Block'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Block Type</label>
            <Select 
              value={selectedBlockType} 
              onValueChange={setSelectedBlockType}
              disabled={editingIndex !== null}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {blockTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderBlockEditor()}

          <div className="flex gap-2">
            {editingIndex !== null ? (
              <>
                <Button 
                  type="button" 
                  onClick={() => updateBlock(editingIndex)}
                  disabled={!blockData.content?.trim()}
                  className="flex-1"
                >
                  Update Block
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                type="button" 
                onClick={addBlock}
                disabled={!blockData.content?.trim()}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Block
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}