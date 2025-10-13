"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { backendURL } from "@/config";
import { toast } from "react-toastify";

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
  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;

  // Fetch Tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get(`${backendURL}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.results || [];
    },
  });

  // Create Task
  const createTask = useMutation({
    mutationFn: (newTask: TaskForm) =>
      axios.post(`${backendURL}/tasks/`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task added!");
      reset();
    },
    onError: () => toast.error("Failed to add task!"),
  });

  // Delete Task
  const deleteTask = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`${backendURL}/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
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
            tasks.map((task) => (
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
      </div>
    </>
  );
}
