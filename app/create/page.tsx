"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { data, error: authError } = await supabase.auth.getUser();
    
      if (authError || !data.user) {
        throw new Error("You must be logged in to create an article");
      }
    
      const { error } = await supabase.from("blogs").insert([
        { 
          title, 
          content, 
          user_id: data.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ]);
    
      if (error) {
        throw new Error(error.message);
      }
    
      toast.success("Article created successfully!");
      router.push("/my-blogs"); 
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

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
              href="/"
              className="mr-6 p-2 rounded-full bg-blue-800 bg-opacity-40 hover:bg-opacity-60 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Article
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
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
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Use clear paragraphs and headings for better readability
              </p>
            </div>
            
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              
              <Button 
                type="submit"
                className="inline-flex items-center px-6"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Publish Article
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}