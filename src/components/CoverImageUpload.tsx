
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface ProjectWithCover extends Tables<'projects'> {
  cover_image?: string;
}

interface CoverImageUploadProps {
  project: ProjectWithCover;
  onUpdate: () => void;
}

const CoverImageUpload = ({ project, onUpdate }: CoverImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadCoverImage = async (file: File) => {
    try {
      setUploading(true);
      
      console.log('Starting upload for project:', project.id);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}-${Date.now()}.${fileExt}`;
      
      console.log('Uploading to path:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('project-covers')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Update the project with the cover image URL
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          cover_image: publicUrl,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', project.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Project updated successfully');

      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      });
      
      onUpdate();
    } catch (error: any) {
      console.error('Full error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to upload cover image',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeCoverImage = async () => {
    try {
      // If there's an existing cover image, try to delete it from storage
      if (project.cover_image) {
        const fileName = project.cover_image.split('/').pop();
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from('project-covers')
            .remove([fileName]);
          
          if (deleteError) {
            console.warn('Could not delete old file:', deleteError);
          }
        }
      }

      const { error } = await supabase
        .from('projects')
        .update({ 
          cover_image: null,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cover image removed successfully",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {project.cover_image ? (
        <div className="relative">
          <img 
            src={project.cover_image} 
            alt="Project cover" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={removeCoverImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <label htmlFor="cover-upload" className="cursor-pointer">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload cover image (JPG, PNG, GIF)
              </span>
              <Input
                id="cover-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Check file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      toast({
                        title: "Error",
                        description: "File size must be less than 5MB",
                        variant: "destructive",
                      });
                      return;
                    }
                    uploadCoverImage(file);
                  }
                }}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}
      
      {!project.cover_image && (
        <div className="text-center">
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('cover-upload')?.click()}
          >
            {uploading ? 'Uploading...' : 'Upload Cover Image'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
