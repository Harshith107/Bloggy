"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserId } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = await getUserId();
        if (!userId) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogId)
          .eq("user_id", userId)
          .single();

        if (error) {
          throw new Error("Failed to fetch article or you don't have permission");
        }

        setTitle(data.title);
        setContent(data.content);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, router]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("You must be logged in");
      }

      const { error } = await supabase
        .from("blogs")
        .update({ 
          title, 
          content,
          updated_at: new Date().toISOString()
        })
        .eq("id", blogId)
        .eq("user_id", userId);

      if (error) {
        throw new Error(error.message);
      }

      // Success - redirect to the blog post
      router.push(`/blog/${blogId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your article...</p>
        </div>
      </div>
    );
  }

  if (error && !title && !content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            href="/my-blogs"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header with subtle pattern */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center">
            <Link 
              href="/my-blogs"
              className="mr-6 p-2 rounded-full bg-blue-800 bg-opacity-40 hover:bg-opacity-60 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Article
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-medium">Please correct the following:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Article Title
              </label>
              <Input
                id="title"
                placeholder="Enter a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg py-6"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Article Content
              </label>
              <Textarea
                id="content"
                placeholder="Write your article content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="resize-y min-h-[400px] font-serif text-gray-800"
              />
              <p className="mt-2 text-sm text-gray-500">
                Use clear paragraphs and headings for better readability
              </p>
            </div>
            
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Link
                href={`/blog/${blogId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              
              <Button 
                onClick={handleUpdate} 
                className="inline-flex items-center px-6"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Article
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}