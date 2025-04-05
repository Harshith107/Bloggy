'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { X } from 'lucide-react'

export default function LogoutDialog() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost" className="text-red-500 hover:underline">
          Logout
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-md backdrop-saturate-150 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl w-full max-w-md transition-all duration-300 scale-95 animate-in fade-in slide-in-from-top-1/2">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">Confirm Logout</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to log out?</p>

          <div className="flex justify-end gap-4">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button variant="destructive" onClick={handleLogout}>
              Yes, Logout
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
