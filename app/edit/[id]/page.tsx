// app/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserId } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (error) {
        alert("Failed to fetch blog");
        return;
      }

      setTitle(data.title);
      setContent(data.content);
    };

    fetchBlog();
  }, [blogId]);

  const handleUpdate = async () => {
    const userId = await getUserId();
    if (!userId) {
      alert("You must be logged in");
      return;
    }

    const { error } = await supabase
      .from("blogs")
      .update({ title, content })
      .eq("id", blogId)
      .eq("author_id", userId); // prevent others from editing

    if (error) {
      alert("Failed to update blog");
      return;
    }

    alert("Blog updated!");
    router.push(`/blog/${blogId}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edit Blog</h1>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />
      <Button onClick={handleUpdate} className="mt-2">
        Update Blog
      </Button>
    </div>
  );
}
