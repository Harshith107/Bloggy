"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { data, error: authError } = await supabase.auth.getUser();
  
    if (authError || !data.user) {
      alert("You must be logged in to create a blog!");
      return;
    }
  
    const { error } = await supabase.from("blogs").insert([
      { title, content, user_id: data.user.id },
    ]);
  
    if (error) {
      toast.error("Error creating blog: " + error.message);
      console.error(error);
      return;
    }
  
    toast.success("Blog created sucessfully!")
    router.push("/"); 
  };
  

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded-md h-40"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
}
