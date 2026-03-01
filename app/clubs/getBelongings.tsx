import { createClient } from "@/lib/supabase/server";

// belongings一覧: 所属先idと所属名を返す
export default async function getBelongings() {
    const supabase = await createClient();
    const { data: belongings, error } = await supabase.from("belongings").select('id, name, created_at, updated_at');
    
    if (error) {
        console.error("Error fetching belongings:", error.message);
        return null;
    }

    return belongings;
}