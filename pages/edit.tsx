import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "../components/Avatar";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import UpdateProfilePicModal from "../components/UpdateProfilePicModal";
import { useAuth } from "../context/AuthContext";
import { auth, db, storage } from "../utils/firebase";

interface FormData {
  name: string;
  username: string;
}

// ADD VALIDATION TO USERNAME IF IS ALREADY IN USE

const Edit = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const defaultValues = {
    name: currentUser?.displayName,
    username: currentUser?.username,
  };
  const { register, handleSubmit, reset } = useForm({ defaultValues });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentUser?.photoURL);

  const selectImage = async (e: any) => {
    const f = e.target?.files[0];
    if (f) {
      setFile(f);
      const base64: any = await convertBase64(f);
      setImagePreview(base64);
    }
  };

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

  const updateImage = () => {
    if (currentUser && file) {
      const storageRef = ref(storage, `/posts/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setIsUpdating(true);
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          setProgress(prog);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            updateProfile(auth.currentUser, {
              photoURL: url,
            }).then(async () => {
              const userRef = doc(db, "users", currentUser.uid);
              const userDocUpdated = {
                photoURL: url,
              };
              await updateDoc(userRef, userDocUpdated);
              setCurrentUser({
                ...currentUser,
                ...userDocUpdated,
              });
              setIsUpdating(false);
              setProgress(0);
            });
          });
        },
      );
    }
  };

  const removeImage = () => {
    if (currentUser && imagePreview && !isUpdating) {
      setIsUpdating(true);
      setImagePreview("");
      updateProfile(auth.currentUser, {
        photoURL: null,
      }).then(async () => {
        const userRef = doc(db, "users", currentUser.uid);
        const userDocUpdated = {
          photoURL: null,
        };
        await updateDoc(userRef, userDocUpdated);
        setCurrentUser({
          ...currentUser,
          ...userDocUpdated,
        });
        setIsUpdating(false);
        setImagePreview("");
        setFile(null);
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);

    setIsSubmiting(true);
    if (auth.currentUser && data.name && data.username) {
      updateProfile(auth.currentUser, {
        displayName: data.name,
      })
        .then(async () => {
          const userRef = doc(db, "users", currentUser.uid);
          const userDocUpdated = {
            displayName: data.name,
            username: data.username,
          };
          await updateDoc(userRef, userDocUpdated);
          setCurrentUser({
            ...currentUser,
            ...userDocUpdated,
          });
          setIsSubmiting(false);
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <Layout>
      <div>
        <div className="flex space-x-4">
          <Avatar
            photoURL={currentUser?.photoURL}
            displayName={currentUser?.displayName}
            size={12}
          />
          <div>
            <h3 className="text-xl">{currentUser?.username}</h3>
            <button
              className="font-semibold text-blue-500"
              onClick={() => setEditProfileIsOpen(true)}
            >
              Change Profile Photo
            </button>
          </div>
        </div>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField label="Name" name="name" register={register} />
          <InputField label="Username" name="username" register={register} />
          <button
            disabled={isSubmiting}
            className={`btn btn-info mt-4 text-white ${
              isSubmiting && "loading"
            }`}
          >
            Submit
          </button>
        </form>
      </div>
      <UpdateProfilePicModal
        isOpen={editProfileIsOpen}
        setIsOpen={setEditProfileIsOpen}
        onChange={selectImage}
        imagePreview={imagePreview}
        removeImage={removeImage}
        updateImage={updateImage}
        isUpdating={isUpdating}
        progress={progress}
      />
    </Layout>
  );
};

export default Edit;
