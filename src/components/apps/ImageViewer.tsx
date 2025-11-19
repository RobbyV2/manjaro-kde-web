import { useDesktopStore } from '@/store/useDesktopStore';
import { findMimeFiles } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';
import { getPublicUrl } from '@/utils/publicUrl';

export const ImageViewer = () => {
  const { apps } = useDesktopStore();
  const app = apps.find(a => a.id === 'image-viewer');
  const [currentImage, setCurrentImage] = useState('');
  
  const images = findMimeFiles(/^image\//);

  useEffect(() => {
    const filepath = app?.params?.filepath;
    if (filepath) {
      setCurrentImage(filepath);
    } else if (images.length > 0 && !currentImage) {
       // Optional: Open first image if none selected? Or stay empty.
       // Legacy behavior seems to open specific file if param passed.
       // ViewerJS in legacy shows gallery.
    }
  }, [app?.params?.filepath, images, currentImage]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
       {currentImage ? (
           <img src={getPublicUrl(`/dolphin-files/${currentImage}`)} alt={currentImage} className="max-w-full max-h-full object-contain" />
       ) : (
           <div className="text-gray-500">No image selected</div>
       )}
       
       {/* Simple Gallery Navigation if needed */}
       {/* This is a simplified version compared to ViewerJS */}
    </div>
  );
};
