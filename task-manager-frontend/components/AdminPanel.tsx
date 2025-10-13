"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-toastify";

type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  is_banned: boolean;
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

type NewUser = {
  username: string;
  email: string;
  password: string;
  role: string;
};

export default function AdminPanel() {
  const qc = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users/");
      return res.data.results || res.data || [];
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks/");
      return res.data.results || res.data || [];
    },
  });

  const toggleBan = useMutation({
    mutationFn: async ({ id, banned }: { id: number; banned: boolean }) => {
      return api.patch(`/admin/users/${id}/`, { is_banned: banned });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
    onError: () => toast.error("Failed to update user"),
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const completeTask = useMutation({
    mutationFn: (id: number) => api.post(`/tasks/${id}/completed/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task marked completed");
    },
    onError: () => toast.error("Failed to complete task"),
  });

  const addUser = useMutation({
    mutationFn: async (newUser: NewUser) => {
      return api.post("/admin/users/generate/", { ...newUser, is_banned: false });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User added successfully");
    },
    onError: () => toast.error("Failed to add user"),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleAddUser = () => {
    addUser.mutate(newUser, {
      onSuccess: () => {
        setIsModalOpen(false);
        setNewUser({ username: "", email: "", password: "", role: "User" });
      },
    });
  };

  if (usersLoading || tasksLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Users column */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Users</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add User
          </button>
        </div>
        <div className="space-y-2">
          {users?.length ? (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <div className="font-medium">
                    {u.username} ({u.role})
                  </div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toggleBan.mutate({ id: u.id, banned: !u.is_banned })
                    }
                    className={`px-3 py-1 rounded text-white ${
                      u.is_banned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {u.is_banned ? "Unban" : "Ban"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>

      {/* Tasks column */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
        <div className="space-y-3">
          {tasks?.length ? (
            tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between p-3 border rounded"
              >
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-gray-500">{t.description}</div>
                  <div
                    className={`text-sm font-medium mt-1 ${
                      t.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {t.status}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {t.status !== "completed" && (
                    <button
                      onClick={() => completeTask.mutate(t.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask.mutate(t.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, username: e.target.value }))
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, password: e.target.value }))
                }
                className="border p-2 w-full rounded"
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, role: e.target.value }))
                }
                className="border p-2 w-full rounded"
              >
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}