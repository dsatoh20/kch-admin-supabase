import { createClient } from "@/lib/supabase/server";

// club affiliation idとclub affiliation nameのセットを返す
export default async function getClubAffiliation() {
    const supabase = await createClient();
    const { data: club_affiliations } = await supabase.from("club_affiliations").select();
    return club_affiliations;
}