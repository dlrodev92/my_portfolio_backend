"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, BookOpen, TrendingUp, Wrench, ArrowRight, Zap, BarChart3 } from "lucide-react";

interface OutcomesSectionProps {
  form: UseFormReturn<ProjectFormData>;
}

// ✅ SOLUCIÓN: Mover ArraySection FUERA del componente
interface ArraySectionProps {
  title: string;
  icon: React.ElementType;
  items: string[];
  inputValue: string;
  inputField: string;
  placeholder: string;
  description: string;
  onInputChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ArraySection = ({ 
  title, 
  icon: Icon, 
  items, 
  inputValue, 
  placeholder, 
  description,
  onInputChange,
  onAddItem,
  onRemoveItem,
  onKeyPress
}: ArraySectionProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="w-4 h-4" />
        {title}
      </CardTitle>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardHeader>
    <CardContent className="space-y-3">
      {/* Existing Items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1 py-1">
              {item}
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add New Item */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onAddItem}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);


 export default function OutcomesSection({ form }: OutcomesSectionProps) {
  const { setValue, watch } = form;
  
  const lessons = watch('lessons') || [];
  const businessOutcomes = watch('businessOutcomes') || [];
  const improvements = watch('improvements') || [];
  const nextSteps = watch('nextSteps') || [];
  const futureTools = watch('futureTools') || [];
  const performanceMetrics = watch('performanceMetrics') || [];

  const [newInputs, setNewInputs] = useState({
    lesson: '',
    businessOutcome: '',
    improvement: '',
    nextStep: '',
    futureTool: '',
    performanceMetric: ''
  });

  // ✅ Funciones específicas para cada array - SIN ANY
  const lessonsHandlers = {
    onInputChange: (value: string) => setNewInputs(prev => ({ ...prev, lesson: value })),
    onAddItem: () => {
      const value = newInputs.lesson.trim();
      if (value) {
        setValue('lessons', [...lessons, value]);
        setNewInputs(prev => ({ ...prev, lesson: '' }));
      }
    },
    onRemoveItem: (index: number) => {
      const newArray = lessons.filter((_, i) => i !== index);
      setValue('lessons', newArray);
    },
    onKeyPress: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = newInputs.lesson.trim();
        if (value) {
          setValue('lessons', [...lessons, value]);
          setNewInputs(prev => ({ ...prev, lesson: '' }));
        }
      }
    }
  };

  const businessOutcomesHandlers = {
    onInputChange: (value: string) => setNewInputs(prev => ({ ...prev, businessOutcome: value })),
    onAddItem: () => {
      const value = newInputs.businessOutcome.trim();
      if (value) {
        setValue('businessOutcomes', [...businessOutcomes, value]);
        setNewInputs(prev => ({ ...prev, businessOutcome: '' }));
      }
    },
    onRemoveItem: (index: number) => {
      const newArray = businessOutcomes.filter((_, i) => i !== index);
      setValue('businessOutcomes', newArray);
    },
    onKeyPress: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = newInputs.businessOutcome.trim();
        if (value) {
          setValue('businessOutcomes', [...businessOutcomes, value]);
          setNewInputs(prev => ({ ...prev, businessOutcome: '' }));
        }
      }
    }
  };

  const improvementsHandlers = {
    onInputChange: (value: string) => setNewInputs(prev => ({ ...prev, improvement: value })),
    onAddItem: () => {
      const value = newInputs.improvement.trim();
      if (value) {
        setValue('improvements', [...improvements, value]);
        setNewInputs(prev => ({ ...prev, improvement: '' }));
      }
    },
    onRemoveItem: (index: number) => {
      const newArray = improvements.filter((_, i) => i !== index);
      setValue('improvements', newArray);
    },
    onKeyPress: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = newInputs.improvement.trim();
        if (value) {
          setValue('improvements', [...improvements, value]);
          setNewInputs(prev => ({ ...prev, improvement: '' }));
        }
      }
    }
  };

  const nextStepsHandlers = {
    onInputChange: (value: string) => setNewInputs(prev => ({ ...prev, nextStep: value })),
    onAddItem: () => {
      const value = newInputs.nextStep.trim();
      if (value) {
        setValue('nextSteps', [...nextSteps, value]);
        setNewInputs(prev => ({ ...prev, nextStep: '' }));
      }
    },
    onRemoveItem: (index: number) => {
      const newArray = nextSteps.filter((_, i) => i !== index);
      setValue('nextSteps', newArray);
    },
    onKeyPress: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = newInputs.nextStep.trim();
        if (value) {
          setValue('nextSteps', [...nextSteps, value]);
          setNewInputs(prev => ({ ...prev, nextStep: '' }));
        }
      }
    }
  };

  const futureToolsHandlers = {
    onInputChange: (value: string) => setNewInputs(prev => ({ ...prev, futureTool: value })),
    onAddItem: () => {
      const value = newInputs.futureTool.trim();
      if (value) {
        setValue('futureTools', [...futureTools, value]);
        setNewInputs(prev => ({ ...prev, futureTool: '' }));
      }
    },
    onRemoveItem: (index: number) => {
      const newArray = futureTools.filter((_, i) => i !== index);
      setValue('futureTools', newArray);
    },
    onKeyPress: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = newInputs.futureTool.trim();
        if (value) {
          setValue('futureTools', [...futureTools, value]);
          setNewInputs(prev => ({ ...prev, futureTool: '' }));
        }
      }
    }
  };

  const performanceMetricsHandlers = {
    onInputChange: (value: string) => setNewInputs(prev => ({ ...prev, performanceMetric: value })),
    onAddItem: () => {
      const value = newInputs.performanceMetric.trim();
      if (value) {
        setValue('performanceMetrics', [...performanceMetrics, value]);
        setNewInputs(prev => ({ ...prev, performanceMetric: '' }));
      }
    },
    onRemoveItem: (index: number) => {
      const newArray = performanceMetrics.filter((_, i) => i !== index);
      setValue('performanceMetrics', newArray);
    },
    onKeyPress: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = newInputs.performanceMetric.trim();
        if (value) {
          setValue('performanceMetrics', [...performanceMetrics, value]);
          setNewInputs(prev => ({ ...prev, performanceMetric: '' }));
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <ArraySection
          title="Lessons Learned"
          icon={BookOpen}
          items={lessons}
          inputValue={newInputs.lesson}
          inputField="lesson"
          placeholder="What did you learn from this project?"
          description="Key insights and learning outcomes from this project"
          {...lessonsHandlers}
        />

        <ArraySection
          title="Business Outcomes"
          icon={TrendingUp}
          items={businessOutcomes}
          inputValue={newInputs.businessOutcome}
          inputField="businessOutcome"
          placeholder="What business value did this create?"
          description="Measurable business impact and value created"
          {...businessOutcomesHandlers}
        />

        <ArraySection
          title="Improvements Made"
          icon={Wrench}
          items={improvements}
          inputValue={newInputs.improvement}
          inputField="improvement"
          placeholder="What improvements were implemented?"
          description="Specific improvements and optimizations made"
          {...improvementsHandlers}
        />

        <ArraySection
          title="Next Steps"
          icon={ArrowRight}
          items={nextSteps}
          inputValue={newInputs.nextStep}
          inputField="nextStep"
          placeholder="What are the planned next steps?"
          description="Future plans and roadmap for this project"
          {...nextStepsHandlers}
        />

        <ArraySection
          title="Future Tools"
          icon={Zap}
          items={futureTools}
          inputValue={newInputs.futureTool}
          inputField="futureTool"
          placeholder="What tools would you use next time?"
          description="Tools or technologies you'd consider for future iterations"
          {...futureToolsHandlers}
        />

        <ArraySection
          title="Performance Metrics"
          icon={BarChart3}
          items={performanceMetrics}
          inputValue={newInputs.performanceMetric}
          inputField="performanceMetric"
          placeholder="What metrics did you track?"
          description="Key performance indicators and measurements"
          {...performanceMetricsHandlers}
        />
      </div>
    </div>
  );
}
