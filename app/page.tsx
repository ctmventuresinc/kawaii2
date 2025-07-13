'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './page.module.css';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.svg', '.heic', '.heif']
    },
    noClick: true,
    noKeyboard: true,
    multiple: false
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  };

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
