import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/lib/supabaseClient";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user?.id;
};
