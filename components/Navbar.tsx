'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import { ModeToggle } from './ModeToggle'
import { Sun, Moon } from 'lucide-react'


export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }
  const router = useRouter()

  useEffect(() => {
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
    await supabase.auth.signOut()
    toast('Logged out successfully!')
    router.push('/login')
  }

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
        <Link href="/" className="text-xl font-bold text-primary">Bloggy</Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
             <Sun className={`h-4 w-4 transition-colors duration-300 ${theme === 'dark' ? 'text-muted-foreground' : 'text-yellow-400'}`} />
  <Switch
    checked={theme === 'dark'}
    onCheckedChange={handleToggle}
    className="data-[state=checked]:bg-tropical_indigo"
    aria-label="Toggle dark mode"
  />
  <Moon className={`h-4 w-4 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300' : 'text-muted-foreground'}`} />
              <Link href="/my-blogs" className="px-4 py-2 rounded hover:bg-gray-200 transition">
                My Blogs
              </Link>
              <Link href="/create" className="text-sm font-medium hover:underline">Create</Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:underline">Login</Link>
              <Link href="/signup" className="text-sm font-medium hover:underline">Signup</Link>
            </>
          )}
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

