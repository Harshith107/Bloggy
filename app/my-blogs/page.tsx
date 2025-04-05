'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Search, Calendar, ArrowRight, BookOpen, Edit, Eye } from 'lucide-react'

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalBlogs, setTotalBlogs] = useState(0)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  
  const blogsPerPage = 9 // Match the home page's blog display count

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log("Authentication check:", user ? "User found" : "No user", authError)
        
        if (authError) {
          console.error("Auth error:", authError)
          setError("Authentication error. Please log in again.")
          setLoading(false)
          return
        }

        if (!user) {
          console.log("No user found - not authenticated")
          setError("Not authenticated. Please log in.")
          setLoading(false)
          return
        }

        setUserId(user.id)
        console.log("User ID:", user.id)

        // Simplified query approach - first check if user has any blogs at all
        const { data: checkData, error: checkError } = await supabase
          .from('blogs')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
        
        console.log("Check for any blogs:", checkData, checkError)
        
        if (checkError) {
          console.error("Error checking for blogs:", checkError)
          setError("Database error. Please try again later.")
          setLoading(false)
          return
        }

        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          
        console.log("Total blogs count:", count, countError)
        
        if (countError) {
          console.error("Count error:", countError)
          setError("Error counting blogs. Please try again.")
          setLoading(false)
          return
        }

        setTotalBlogs(count || 0)

        // Calculate pagination
        const from = (page - 1) * blogsPerPage
        const to = from + blogsPerPage - 1

        // Build the base query
        let query = supabase
          .from('blogs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        // Add search if provided
        if (searchTerm) {
          // Fix the search syntax - the previous OR syntax might have issues
          query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        }
        
        // Add pagination last
        query = query.range(from, to)

        const { data, error: fetchError } = await query
        console.log("Blog fetch results:", data?.length || 0, "blogs found", fetchError)
        
        if (fetchError) {
          console.error("Error fetching blogs:", fetchError)
          setError("Error loading blogs. Please try again.")
        } else {
          setBlogs(data || [])
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserBlogs()
  }, [page, searchTerm])

  // Handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1) // Reset to first page on new search
  }

  const totalPages = Math.ceil(totalBlogs / blogsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header with subtle pattern - matching home page style */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                My Articles
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Manage and review all your contributions
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                href="/create"
                className="inline-flex items-center bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition shadow-lg"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                <span>New Article</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar with improved styling */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <input
            type="text"
            placeholder="Search your articles by title or content..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
          />
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

       

        {/* Content area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
              <div className="space-y-4 flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No articles found</p>
            {searchTerm && (
              <p className="mt-2 text-gray-400">
                Try adjusting your search criteria
              </p>
            )}
            {!searchTerm && (
              <p className="mt-2 text-gray-400">
                <Link href="/create" className="text-blue-600 hover:underline">
                  Create your first article
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => {
              // Determine if this is a featured article (first item)
              const isFeatured = index === 0 && page === 1;
              
              return (
                <div 
                  key={blog.id} 
                  className={`${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <article className="h-full flex flex-col rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-300 bg-white group">
                    {/* Date and category */}
                    <div className="px-5 pt-5 pb-2">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <div className="flex items-center text-blue-600 font-medium">
                          <Calendar className="h-4 w-4 mr-2" />
                          <time dateTime={blog.created_at}>
                            {new Date(blog.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                        <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                          Your Article
                        </span>
                      </div>
                    </div>
                    
                    {/* Title - display full title */}
                    <div className="px-5 pb-3">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition duration-300">
                        {blog.title}
                      </h2>
                    </div>
                    
                    {/* Content - max 2 lines with ellipsis */}
                    <div className="px-5 pb-5 flex-grow">
                      <p className="text-gray-600 line-clamp-2">
                        {blog.content || 'No content'}
                      </p>
                    </div>
                    
                    {/* Footer with actions */}
                    <div className="px-5 py-4 mt-auto bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/edit/${blog.id}`}
                          className="inline-flex items-center text-yellow-600 font-medium hover:text-yellow-700 transition"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                        
                        <Link 
                          href={`/blog/${blog.id}`}
                          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Article
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}

        {/* Only show pagination if there's more than one page */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-12 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>
            
            <div className="text-sm font-medium text-gray-700">
              Page <span className="text-blue-600">{page}</span> of <span className="text-blue-600">{totalPages}</span>
            </div>
            
            <button
              onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={page === totalPages || loading}
              className="flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700"
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}