
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface CoverImageUploadProps {
  project: Tables<'projects'>;
  onUpdate: () => void;
}

const CoverImageUpload = ({ project, onUpdate }: CoverImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadCoverImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${project.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-covers')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('projects')
        .update({ cover_image: publicUrl })
        .eq('id', project.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeCoverImage = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ cover_image: null })
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
                Click to upload cover image
              </span>
              <Input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadCoverImage(file);
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
