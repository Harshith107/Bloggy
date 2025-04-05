'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function BlogDetail({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Failed to fetch blog:', error)
        return
      }

      setBlog(data)
    }

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)
    }

    fetchBlog()
    fetchUser()
  }, [params.id])

  if (!blog) return <p>Loading...</p>

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;
  
    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);
    if (error) {
      alert("Error deleting blog");
      return;
    }
  
    alert("Blog deleted");
    router.push("/");
  };  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-4">
        Posted on {new Date(blog.created_at).toLocaleDateString()}
      </p>
      <p className="text-lg leading-relaxed">{blog.content}</p>

      {userId === blog.user_id && (
        <div className="mt-6 flex gap-4">
          <Link
            href={`/edit/${blog.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
             Delete
          </button>

          
        </div>
      )}
    </div>
  )
}
