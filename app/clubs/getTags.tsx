import { createClient } from "@/lib/supabase/server";


// club affiliation idとclub affiliation nameのセットを返す
export default async function getTags() {
    const supabase = await createClient();
    const { data: tags } = await supabase.from("tags").select();
    return tags;
}