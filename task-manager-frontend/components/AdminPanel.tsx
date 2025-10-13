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

  // local state to make reordering instant
  const [usersState, setUsersState] = useState<AdminUser[]>([]);
  const [tasksState, setTasksState] = useState<Task[]>([]);
  const [dragging, setDragging] = useState<{ list: "users" | "tasks"; index: number } | null>(null);

  useEffect(() => {
    if (users) setUsersState(users);
  }, [users]);

  useEffect(() => {
    if (tasks) setTasksState(tasks);
  }, [tasks]);

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

  if (usersLoading || tasksLoading) return <p>Loading...</p>;

  // Helpers
  function reorder<T>(list: T[], from: number, to: number) {
    const copy = Array.from(list);
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }

  // Drag handlers using native HTML5 drag/drop
  const onDragStart = (e: React.DragEvent, list: "users" | "tasks", index: number) => {
    e.dataTransfer.setData("text/plain", `${list}:${index}`);
    e.dataTransfer.effectAllowed = "move";
    setDragging({ list, index });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const onDropOnItem = (e: React.DragEvent, destList: "users" | "tasks", destIndex: number) => {
    e.preventDefault();
    const payload = e.dataTransfer.getData("text/plain");
    if (!payload) return;
    const [srcList, srcIndexStr] = payload.split(":");
    const srcIndex = Number(srcIndexStr);
    if (srcList !== destList) {
      // currently do not support cross-list moves
      setDragging(null);
      return;
    }

    if (destList === "users") {
      if (srcIndex === destIndex) return setDragging(null);
      const ordered = reorder(usersState, srcIndex, destIndex);
      setUsersState(ordered);
      qc.setQueryData(["admin-users"], ordered);
    } else {
      if (srcIndex === destIndex) return setDragging(null);
      const ordered = reorder(tasksState, srcIndex, destIndex);
      setTasksState(ordered);
      qc.setQueryData(["tasks"], ordered);
    }
    setDragging(null);
  };

  // drop on list container to move to end
  const onDropOnList = (e: React.DragEvent, destList: "users" | "tasks") => {
    e.preventDefault();
    const payload = e.dataTransfer.getData("text/plain");
    if (!payload) return;
    const [srcList, srcIndexStr] = payload.split(":");
    const srcIndex = Number(srcIndexStr);
    if (srcList !== destList) {
      setDragging(null);
      return;
    }

    if (destList === "users") {
      if (srcIndex === usersState.length - 1) return setDragging(null);
      const copy = Array.from(usersState);
      const [moved] = copy.splice(srcIndex, 1);
      copy.push(moved);
      setUsersState(copy);
      qc.setQueryData(["admin-users"], copy);
    } else {
      if (srcIndex === tasksState.length - 1) return setDragging(null);
      const copy = Array.from(tasksState);
      const [moved] = copy.splice(srcIndex, 1);
      copy.push(moved);
      setTasksState(copy);
      qc.setQueryData(["tasks"], copy);
    }
    setDragging(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Users column */}
      <div
        className="bg-white p-4 rounded-xl shadow"
        onDragOver={onDragOver}
        onDrop={(e) => onDropOnList(e, "users")}
      >
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <div className="space-y-2">
          {usersState?.length ? (
            usersState.map((u, index) => {
              const isDragging = dragging?.list === "users" && dragging.index === index;
              return (
                <div
                  key={u.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, "users", index)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDropOnItem(e, "users", index)}
                  onDragEnd={() => setDragging(null)}
                  className={`flex items-center justify-between p-3 border rounded transition ${
                    isDragging ? "opacity-60 bg-gray-50 shadow-md" : "bg-white"
                  }`}
                >
                  <div>
                    <div className="font-medium">
                      {u.username} ({u.role})
                    </div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBan.mutate({ id: u.id, banned: !u.is_banned })}
                      className={`px-3 py-1 rounded text-white ${
                        u.is_banned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {u.is_banned ? "Unban" : "Ban"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>

      {/* Tasks column */}
      <div
        className="bg-white p-4 rounded-xl shadow"
        onDragOver={onDragOver}
        onDrop={(e) => onDropOnList(e, "tasks")}
      >
        <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
        <div className="space-y-3">
          {tasksState?.length ? (
            tasksState.map((t, index) => {
              const isDragging = dragging?.list === "tasks" && dragging.index === index;
              return (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, "tasks", index)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDropOnItem(e, "tasks", index)}
                  onDragEnd={() => setDragging(null)}
                  className={`flex items-start justify-between p-3 border rounded transition ${
                    isDragging ? "opacity-60 bg-gray-50 shadow-md" : "bg-white"
                  }`}
                >
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-sm text-gray-500">{t.description}</div>
                    <div className={`text-sm font-medium mt-1 ${t.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
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
              );
            })
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
}