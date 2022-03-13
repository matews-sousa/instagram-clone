import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (
    file: File,
    folder: string = "files",
    getUrl: (url: string) => void,
  ) => {
    const storageRef = ref(storage, `/${folder}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setIsUploading(false);
          setProgress(0);
          getUrl(url);
        });
      },
    );
  };

  return { upload, isUploading, progress };
};

export default useFileUpload;
