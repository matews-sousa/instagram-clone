import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { XIcon } from "@heroicons/react/solid";
import Head from "next/head";

type FormInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email.")
    .required("Email is a required field."),
  password: yup
    .string()
    .min(6, "Password must have at least 6 characters.")
    .required("Password is a required field."),
});

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ mode: "onBlur", resolver: yupResolver(schema) });
  const { signIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormInputs) => {
    try {
      await signIn(data.email, data.password);
      router.push("/");
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("User not found.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Wrong password.");
          break;
        case "auth/too-many-requests":
          setErrorMessage("Too many requests.");
          break;
      }
    }
  };

  return (
    <div className="align-center flex h-screen w-screen justify-center bg-gray-100 py-10">
      <Head>
        <title>Login | Instagram</title>
      </Head>
      <div className="px-4">
        <div className="max-w-sm border-[1px] border-gray-300 bg-white p-11">
          <div className="flex flex-col items-center">
            <img src="/img/Logo.svg" alt="Instagram Logo" className="w-48" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col"
          >
            {errorMessage && (
              <div className="flex items-center justify-center gap-4 rounded-sm border-[1px] border-red-500 bg-red-400 p-2 text-center font-semibold text-white">
                {errorMessage}
                <button type="button" onClick={() => setErrorMessage("")}>
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            <InputField
              label="Email"
              name="email"
              register={register}
              error={errors.email?.message}
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
              Log In
            </button>
          </form>
        </div>
        <div className="mt-4 border border-gray-300 bg-white p-6">
          <p className="text-center">
            Don{"'"}t have an account?{" "}
            <Link href="/sign-up">
              <a className="link link-primary">Sign Up</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
