import { createClient } from "@/lib/supabase/server";

// on_carousel tableにrowが存在するclub_events_idを返す
export async function getOnCarouselEventIDs() {
    const supabase = await createClient();
    const { data: event_ids, error } = await supabase
      .from("on_carousel")
      .select("club_events_id")

    if (error) {
        console.error("Error fetching on_carousel clubs:", error);
        return [];
    }

    return event_ids || [];
}