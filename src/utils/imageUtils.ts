/**
 * Utility for processing and optimizing image files from local system files / file explorer
 */
export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
  fileName: string;
}

export function processImageFile(file: File, maxDimension: number = 512): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file from system files.'));
    
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image content or corrupt file.'));
      
      img.onload = () => {
        const targetSize = maxDimension;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          return reject(new Error('Could not initialize 2D canvas context.'));
        }

        // Calculate aspect ratio for smart center-crop
        const aspect = img.width / img.height;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;

        if (aspect > 1) {
          // Horizontal landscape image: crop sides
          sw = img.height;
          sx = (img.width - sw) / 2;
        } else if (aspect < 1) {
          // Vertical portrait image: crop top/bottom with 35% bias towards top (eyes/face region)
          sh = img.width;
          sy = Math.max(0, (img.height - sh) * 0.35);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetSize, targetSize);

        // Export as optimized JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          width: img.width,
          height: img.height,
          sizeKb: approxKb,
          fileName: file.name
        });
      };
      
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
