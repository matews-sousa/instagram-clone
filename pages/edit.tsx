import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import usernameAlreadyInUse from "../utils/usernameAlreadyInUse";
import useFileUpload from "../hooks/useFileUpload";
import useImageSelection from "../hooks/useImageSelection";
import Avatar from "../components/Avatar";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import UpdateProfilePicModal from "../components/UpdateProfilePicModal";

interface FormInputs {
  name?: string | null;
  username?: string | null;
}

const schema = yup.object({
  name: yup.string().required("Name is a required field."),
  username: yup
    .string()
    .test("in-use", "Username already in use.", (value) => {
      return usernameAlreadyInUse(value);
    })
    .required("Username is a required field."),
});

const Edit = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const defaultValues: FormInputs = {
    name: currentUser?.displayName,
    username: currentUser?.username,
  };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const { upload, isUploading, progress } = useFileUpload();
  const { selectImage, file, imagePreview, setImagePreview, setFile } =
    useImageSelection(currentUser?.photoURL);

  const updateImage = async () => {
    if (file) {
      await upload(file, "avatars", (url) => {
        if (currentUser && auth.currentUser) {
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
          });
        }
      });
    }
  };

  const removeImage = () => {
    if (auth.currentUser && currentUser && imagePreview) {
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
        setImagePreview("");
        setFile(null);
      });
    }
  };

  const onSubmit = async (data: FormInputs) => {
    setIsSubmiting(true);
    if (auth.currentUser && data.name && data.username && currentUser) {
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

  // remove spaces from username
  const username = watch("username");
  useEffect(() => {
    if (username) setValue("username", username.trim());
  }, [username]);

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
          <InputField
            label="Name"
            name="name"
            register={register}
            error={errors.name?.message}
          />
          <InputField
            label="Username"
            name="username"
            register={register}
            error={errors.username?.message}
          />
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
        isUpdating={isUploading}
        progress={progress}
      />
    </Layout>
  );
};

export default Edit;
