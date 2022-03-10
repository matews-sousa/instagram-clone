import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../components/InputField";
import { useEffect, useState } from "react";

type FormInputs = {
  email: string;
  username: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email.")
    .required("Email is a required field."),
  username: yup
    .string()
    .test("in-use", "Username already in use.", async (value) => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", value));
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty;
    })
    .required("Username is a required field."),
  password: yup
    .string()
    .min(6, "Password must have at least 6 characters.")
    .required("Password is a required field."),
});

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ mode: "onBlur", resolver: yupResolver(schema) });
  const { signUp } = useAuth();
  const router = useRouter();

  // remove spaces from username
  const username = watch("username");
  useEffect(() => {
    if (username) setValue("username", username.trim());
  }, [username]);

  const onSubmit = async (data: FormInputs) => {
    try {
      await signUp(data.username, data.email, data.password);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use.");
      }
    }
  };

  return (
    <div className="align-center flex h-screen w-screen justify-center bg-gray-100 py-10">
      <div className="px-4">
        <div className="max-w-sm border-[1px] border-gray-300 bg-white p-11">
          <div className="flex flex-col items-center">
            <img src="/img/Logo.svg" alt="Instagram Logo" className="w-48" />
            <p className="mt-2 text-center text-xl font-semibold text-gray-500">
              Sign up to see photos and videos from your friends.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col"
          >
            <InputField
              label="Email"
              name="email"
              register={register}
              error={errors.email?.message || errorMessage}
            />
            <InputField
              label="Username"
              name="username"
              register={register}
              error={errors.username?.message}
            />
            <InputField
              type="password"
              label="Password"
              name="password"
              register={register}
              error={errors.password?.message}
            />
            <button
              disabled={isSubmitting}
              className="mt-4 flex items-center justify-center gap-2 rounded-sm bg-blue-500 p-1 font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting && (
                <svg
                  role="status"
                  className="h-4 w-4 animate-spin fill-blue-600 text-gray-200"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
              Sign Up
            </button>
          </form>
        </div>
        <div className="mt-4 border border-gray-300 bg-white p-6">
          <p className="text-center">
            Have an account?{" "}
            <Link href="/login">
              <a className="text-cyan-800">Login</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
