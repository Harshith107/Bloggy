// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function HomePage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const blogsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  const fetchBlogs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
      return;
    }

    const filteredBlogs = data.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setBlogs(filteredBlogs);
    setLoading(false);
  };

  fetchBlogs();
}, [searchTerm]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)

      const from = (page - 1) * blogsPerPage
      const to = from + blogsPerPage - 1

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching blogs:', error)
        return
      }

      setBlogs(data)
      setLoading(false)
    }

    fetchBlogs()
  }, [page])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
  href="/create"
  className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
>
  + New Blog
</Link>
<div className="mb-4">
  <input
    type="text"
    placeholder="Search blogs..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full border px-4 py-2 rounded"
  />
</div>

      {/* <Link
        href="/login"
        className="inline-block mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">login</Link> */}
      <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
      {loading ? (
  <p>Loading blogs...</p>
) : blogs.length === 0 ? (
  <p className="text-gray-500">No blogs yet. Be the first to write one!</p>
) : (
  <div className="space-y-4">
    {blogs.map((blog) => (
      <Link href={`/blog/${blog.id}`} key={blog.id}>
        <div className="p-4 border rounded cursor-pointer hover:shadow-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold">{blog.title}</h2>
          <p className="text-sm text-gray-600">
            {new Date(blog.created_at).toLocaleDateString()}
          </p>
          <p className="mt-2 text-gray-700 line-clamp-2">
            {blog.content?.slice(0, 120) || 'No content'}...
          </p>
        </div>
      </Link>
    ))}
  </div>
)}


      {/* Pagination controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}
