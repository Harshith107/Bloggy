'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Calendar, Edit, Trash2, ArrowLeft, Clock, Share2 } from 'lucide-react'
import {useParams} from 'next/navigation'

export default function BlogDetail() {
   const params = useParams();
  const [blog, setBlog] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [estimatedReadTime, setEstimatedReadTime] = useState<string>("3 min")
  const router = useRouter()

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
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
      
      // Calculate estimated reading time (average 200 words per minute)
      if (data?.content) {
        const wordCount = data.content.split(/\s+/).length
        const readTime = Math.max(1, Math.ceil(wordCount / 200))
        setEstimatedReadTime(`${readTime} min read`)
      }
      
      setLoading(false)
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

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this article?")
    if (!confirmDelete) return

    const { error } = await supabase.from("blogs").delete().eq("id", blog.id)
    if (error) {
      alert("Error deleting article")
      return
    }

    alert("Article successfully deleted")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <div className="animate-pulse space-y-8 w-full max-w-3xl px-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Article not found</h2>
        <Link 
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Return to homepage
        </Link>
      </div>
    )
  }

  // Format the date nicely
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header banner with subtle pattern */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors w-fit"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to articles
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{blog.title}</h1>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article metadata */}
        <div className="flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center text-blue-600">
              <Calendar className="h-5 w-5 mr-2" />
              <time dateTime={blog.created_at} className="text-sm">
                {formattedDate}
              </time>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-sm">{estimatedReadTime}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
            >
              <Share2 className="h-5 w-5 mr-1" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
        
        {/* Article content */}
        <div className="prose prose-blue max-w-none">
          {blog.content.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="mb-6 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Author actions if current user is author */}
      {userId === blog.user_id && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-end gap-4">
            <Link
              href={`/edit/${blog.id}`}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition text-gray-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Article
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Article
            </button>
          </div>
        </div>
      )}

      {/* Related articles or newsletter signup could go here */}
     
    </div>
  )
}