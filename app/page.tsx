'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './page.module.css';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        let fileToProcess = file;
        
        // Check if it's a HEIC/HEIF file and convert it
        if (file.type === 'image/heic' || file.type === 'image/heif' || 
            file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
          
          console.log('Converting HEIC file...');
          // Dynamic import to avoid SSR issues
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          }) as Blob;
          
          fileToProcess = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg'
          });
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result as string);
        };
        reader.onerror = () => {
          alert('Error reading file. Please try a different image format.');
        };
        reader.readAsDataURL(fileToProcess);
        
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing the image. Please try a different file.');
      }
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.svg'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif']
    },
    noClick: true,
    noKeyboard: true,
    multiple: false,
    disabled: !isClient
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isClient) {
      open();
    }
  };

  if (!isClient) {
    return (
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <h1 className={styles.title}>
            Kawaii App
          </h1>
          <p className={styles.subtitle}>
            Loading...
          </p>
        </main>
        <button className={styles.bottomButton}>
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container} {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Main content area */}
      <main className={styles.mainContent}>
        {uploadedImage ? (
          <div className={styles.imageContainer}>
            <img 
              src={uploadedImage} 
              alt="Uploaded photo" 
              className={styles.uploadedImage}
            />
          </div>
        ) : (
          <>
            <h1 className={styles.title}>
              Kawaii App
            </h1>
            <p className={styles.subtitle}>
              Mobile-first design with fixed bottom button
            </p>
          </>
        )}
      </main>
      
      {/* Fixed bottom button */}
      <button 
        className={styles.bottomButton}
        onClick={handleButtonClick}
      >
        {uploadedImage ? 'Change Photo' : 'Tap Me!'}
      </button>
    </div>
  );
}
