"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import api from "@/lib/api"; // use axios instance with interceptor
import { toast } from "react-toastify";
import AdminPanel from "@/components/AdminPanel";
import React, { useState, useEffect } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

type TaskForm = {
  title: string;
  description: string;
  status: string;
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<TaskForm>();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  // show admin panel when role === "admin"
  if (user?.role === "admin") {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto py-10">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <AdminPanel />
        </div>
      </>
    );
  }

  // Search state for user tasks
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // Total pages from the API

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // User task list with search and pagination functionality
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", debouncedSearch, currentPage],
    queryFn: async () => {
      const url = debouncedSearch
        ? `/tasks/?search=${encodeURIComponent(debouncedSearch)}&page=${currentPage}`
        : `/tasks/?page=${currentPage}`;
      const res = await api.get(url);
      setTotalPages(Math.ceil(res.data.count / 10)); // Assuming 10 tasks per page
      return res.data.results || [];
    },
    placeholderData: [],
  });

  const createTask = useMutation({
    mutationFn: (newTask: TaskForm) => api.post("/tasks/", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task added!");
      reset();
    },
    onError: () => toast.error("Failed to add task!"),
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted!");
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading tasks...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

        {/* Search input */}
        <div className="mb-3 flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="border p-2 rounded w-full"
          />
          <button
            onClick={() => setSearch("")}
            className="px-3 bg-gray-200 rounded"
          >
            Clear
          </button>
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleSubmit((data) => createTask.mutate(data))}
          className="bg-white p-4 rounded-xl shadow mb-6"
        >
          <input
            {...register("title")}
            placeholder="Title"
            className="border p-2 w-full mb-3 rounded"
            required
          />
          <textarea
            {...register("description")}
            placeholder="Description"
            className="border p-2 w-full mb-3 rounded"
            required
          />
          <select
            {...register("status")}
            className="border p-2 w-full mb-3 rounded"
            defaultValue="pending"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {tasks?.length ? (
            tasks.map((task: Task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <p
                    className={`text-sm font-medium ${
                      task.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {task.status}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks available</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}