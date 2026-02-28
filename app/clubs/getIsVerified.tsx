import { createClient } from "@/lib/supabase/server";

// is_verified tableにrowが存在するclub_idを返す
export async function getVerifiedClubIDs() {
    const supabase = await createClient();
    const { data: club_ids, error } = await supabase
      .from("is_verified")
      .select("club_id")

    if (error) {
        console.error("Error fetching verified clubs:", error);
        return [];
    }

    return club_ids || [];
}