import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://iecolmyyghmfemeoqzgy.supabase.co";

const supabaseKey =
  "PASTE_YOUR_PUBLISHABLE_KEY";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
