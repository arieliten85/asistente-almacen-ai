import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Cliente para uso en el servidor (server components, route handlers)
export const supabase = createClient(supabaseUrl, supabaseKey);
