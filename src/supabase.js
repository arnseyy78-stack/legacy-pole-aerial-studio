import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://iecolmyyghmfemeoqzgy.supabase.co";

const supabaseKey =
  "sb_publishable_KyeYfopz-LIJzfqwUaPCOw_ClX926r9";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
