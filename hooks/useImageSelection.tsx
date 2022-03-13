import { useState } from "react";

const useImageSelection = (defaultImagePreview: string | null | undefined) => {
  const [file, setFile] = useState<File | null>();
  const [imagePreview, setImagePreview] = useState<string | undefined | null>(
    defaultImagePreview,
  );

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const selectImage = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const f: File = (target.files as FileList)[0];
    if (f) {
      setFile(f);
      const base64: any = await convertBase64(f);
      setImagePreview(base64);
    }
  };

  return { file, imagePreview, selectImage, setImagePreview, setFile };
};

export default useImageSelection;
