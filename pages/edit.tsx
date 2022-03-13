import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "../components/Avatar";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../utils/firebase";

interface FormData {
  name: string;
  username: string;
}

const Edit = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();
  const defaultValues = {
    name: currentUser?.displayName,
    username: currentUser?.username,
  };
  const { register, handleSubmit, reset } = useForm({ defaultValues });

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
            <button className="font-semibold text-blue-500">
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
    </Layout>
  );
};

export default Edit;
