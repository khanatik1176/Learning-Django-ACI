"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { backendURL } from "@/config";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, reset } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await axios.post(`${backendURL}/register/`, data);
      toast.success("Registration successful!");
      reset();
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed! Try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md p-6 rounded-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          {...register("username")}
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          Register
        </button>

        <p
          className="text-sm text-center mt-3 text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
