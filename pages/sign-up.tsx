import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../components/InputField";
import { useEffect, useState } from "react";
import usernameAlreadyInUse from "../utils/usernameAlreadyInUse";
import Head from "next/head";

type FormInputs = {
  email: string;
  name: string;
  username: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email.")
    .required("Email is a required field."),
  name: yup.string().required("Name is a required field."),
  username: yup
    .string()
    .test("in-use", "Username already in use.", (value) => {
      return usernameAlreadyInUse(value);
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
      await signUp(data.name, data.username, data.email, data.password);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use.");
      }
    }
  };

  return (
    <div className="align-center flex h-full min-h-screen justify-center overflow-hidden bg-gray-100 py-10">
      <Head>
        <title>Sign Up | Instagram</title>
      </Head>
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
            <InputField
              type="password"
              label="Password"
              name="password"
              register={register}
              error={errors.password?.message}
            />
            <button
              disabled={isSubmitting}
              className={`btn btn-accent btn-sm mt-4 normal-case ${
                isSubmitting && "loading"
              }`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="mt-4 border border-gray-300 bg-white p-6">
          <p className="text-center">
            Have an account?{" "}
            <Link href="/login">
              <a className="link link-primary">Login</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
