"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { backendURL } from "@/config";
import { toast } from "react-toastify";

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await axios.post(`${backendURL}/login/`, data);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md p-6 rounded-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          {...register("username")}
          placeholder="Username"
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
          Login
        </button>

        <p
          className="text-sm text-center mt-3 text-blue-600 cursor-pointer"
          onClick={() => router.push("/register")}
        >
          Don’t have an account? Register
        </p>
      </form>
    </div>
  );
}
