'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { 
  Menu, 
  X, 
  PenSquare, 
  BookOpen, 
  UserCircle, 
  LogOut 
} from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast('Logged out successfully!')
    // router.push('/login')
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bloggy
                </span>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {user ? (
                <>
                  <Link 
                    href="/my-blogs" 
                    className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />My Blogs
                  </Link>
                  
                  <Link 
                    href="/create" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow text-sm font-medium"
                  >
                    <PenSquare className="h-4 w-4 mr-2" />Create
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center focus:outline-none">
                      <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-gray-800">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.email}</p>
                      </div>
                      {/* <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                        <UserCircle className="h-4 w-4 mr-2" />Profile
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={() => setShowLogoutDialog(true)}>
                        <LogOut className="h-4 w-4 mr-2" />Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Login
                  </Link>
                  
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-800">
            {user ? (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.email}</div>
                  </div>
                </div>
                
                <Link 
                  href="/my-blogs" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-3" />My Blogs
                  </div>
                </Link>
                
                <Link 
                  href="/create" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <PenSquare className="h-5 w-5 mr-3" />Create
                  </div>
                </Link>
                
                {/* <Link 
                  href="/profile" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <UserCircle className="h-5 w-5 mr-3" />Profile
                  </div>
                </Link> */}
                
                <button 
                  onClick={() => setShowLogoutDialog(true)}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                
                <Link 
                  href="/signup" 
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          <DialogContent className="z-50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border shadow-2xl rounded-lg">
            <DialogHeader>
              <DialogTitle>Are you sure you want to logout?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}