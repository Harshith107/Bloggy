'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUserId(user.id)

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user blogs:', error)
      } else {
        setBlogs(data)
      }

      setLoading(false)
    }

    fetchUserBlogs()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs found. Go create one!</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="p-4 border rounded hover:bg-gray-100 transition"
            >
              <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-4">
                <Link
                  href={`/blog/${blog.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/edit/${blog.id}`}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
