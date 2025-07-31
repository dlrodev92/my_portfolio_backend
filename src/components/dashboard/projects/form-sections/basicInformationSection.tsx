"use client";

import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/lib/schemas/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Calendar, FileText, Flag, Briefcase, User, Building, Server } from "lucide-react";

interface BasicInformationSectionProps {
 form: UseFormReturn<ProjectFormData>;
}

const PROJECT_TYPES = [
 { 
   value: 'PERSONAL', 
   label: 'Personal Project', 
   description: 'Personal side projects and experiments',
   icon: User
 },
 { 
   value: 'FREELANCE', 
   label: 'Freelance Work', 
   description: 'Client work and freelance projects',
   icon: Building
 },
 { 
   value: 'DEVOPS', 
   label: 'DevOps Project', 
   description: 'Infrastructure and deployment projects',
   icon: Server
 },
];

export default function BasicInformationSection({ form }: BasicInformationSectionProps) {
 const { register, setValue, watch, formState: { errors } } = form;
 const status = watch('status');
 const type = watch('type');

 return (
   <div className="space-y-6">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="space-y-2">
         <Label htmlFor="title" className="flex items-center gap-2">
           <FileText className="w-4 h-4" />
           Project Title *
         </Label>
         <Input
           id="title"
           placeholder="e.g., Portfolio Website Redesign"
           {...register('title')}
           className={errors.title ? 'border-destructive' : ''}
         />
         {errors.title && (
           <p className="text-sm text-destructive">{errors.title.message}</p>
         )}
         <p className="text-xs text-muted-foreground">
           A clear, descriptive title for your project
         </p>
       </div>

       <div className="space-y-2">
         <Label className="flex items-center gap-2">
           <Briefcase className="w-4 h-4" />
           Project Type *
         </Label>
         <Select 
           value={type || ""} 
           onValueChange={(value) => setValue('type', value as 'PERSONAL' | 'FREELANCE' | 'DEVOPS')}
         >
           <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
             <SelectValue placeholder="Select project type" />
           </SelectTrigger>
           <SelectContent>
             {PROJECT_TYPES.map((projectType) => {
               const IconComponent = projectType.icon;
               return (
                 <SelectItem key={projectType.value} value={projectType.value}>
                   <div className="flex items-center gap-3">
                     <IconComponent className="w-4 h-4" />
                     <div className="flex flex-col">
                       <span className="font-medium">{projectType.label}</span>
                       <span className="text-xs text-muted-foreground">{projectType.description}</span>
                     </div>
                   </div>
                 </SelectItem>
               );
             })}
           </SelectContent>
         </Select>
         {errors.type && (
           <p className="text-sm text-destructive">{errors.type.message}</p>
         )}
         <p className="text-xs text-muted-foreground">
           Categorize your project by its nature and purpose
         </p>
       </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="space-y-2">
         <Label className="flex items-center gap-2">
           <Flag className="w-4 h-4" />
           Project Status *
         </Label>
         <Select 
           value={status || ""} 
           onValueChange={(value) => setValue('status', value as 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED')}
         >
           <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
             <SelectValue placeholder="Select status" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="LIVE">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full" />
                 Live
               </div>
             </SelectItem>
             <SelectItem value="IN_PROGRESS">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-orange-500 rounded-full" />
                 In Progress
               </div>
             </SelectItem>
             <SelectItem value="ARCHIVED">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-gray-500 rounded-full" />
                 Archived
               </div>
             </SelectItem>
           </SelectContent>
         </Select>
         {errors.status && (
           <p className="text-sm text-destructive">{errors.status.message}</p>
         )}
         <p className="text-xs text-muted-foreground">
           Current status of your project
         </p>
       </div>

       <div className="space-y-2">
         <Label htmlFor="publishedAt" className="flex items-center gap-2">
           <Calendar className="w-4 h-4" />
           Published Date (optional)
         </Label>
         <Input
           id="publishedAt"
           type="datetime-local"
           {...register('publishedAt')}
         />
         <p className="text-xs text-muted-foreground">
           Leave empty for drafts. Set a future date to schedule publication.
         </p>
       </div>
     </div>

     <div className="space-y-2">
       <Label htmlFor="subtitle">
         Project Subtitle *
       </Label>
       <Textarea
         id="subtitle"
         placeholder="A brief, engaging description of your project..."
         rows={2}
         {...register('subtitle')}
         className={errors.subtitle ? 'border-destructive' : ''}
       />
       {errors.subtitle && (
         <p className="text-sm text-destructive">{errors.subtitle.message}</p>
       )}
       <p className="text-xs text-muted-foreground">
         A short description that will appear in project listings (max 200 characters)
       </p>
     </div>
   </div>
 );
}