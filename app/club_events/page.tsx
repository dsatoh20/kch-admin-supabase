import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { get } from "http";
import { getOnCarouselEventIDs } from "./getOnCarousel";

// club_events一覧を取得
async function getClubEvents() {
  const supabase = await createClient();
  const { data: club_events } = await supabase.from("club_events").select();

  return club_events;
}

// 非同期コンポーネント
async function EventsContent() {
  const club_events = await getClubEvents();
  const on_carousel_event_ids = await getOnCarouselEventIDs() || [];

  // club_eventsの各レコードにon_carouselフィールドを追加
  const club_events_with_carousel = club_events?.map((event) => ({
    ...event,
    on_carousel: on_carousel_event_ids.some((id) => id.club_events_id === event.id),
  })) || [];

  return(
    <>
    {club_events_with_carousel && club_events_with_carousel.length > 0 ? 
        <div className="mx-auto p-4">
        <p className="text-lg mt-8 text-center">サークルイベント一覧</p>
        <Table className="w-full my-8">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>OnCarousel</TableHead>
              <TableHead>UpdatedAt</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          {club_events_with_carousel.map((club_event) => (
            <TableRow key={club_event.id}>
              <TableCell>{club_event.id}</TableCell>
              <TableCell>{club_event.club_name}</TableCell>
              <TableCell>{club_event.description}</TableCell>
              <TableCell>{new Date(club_event.date).toLocaleDateString()}</TableCell>
              <TableCell>{club_event.location}</TableCell>
              <TableCell>{club_event.on_carousel ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(club_event.updated_at).toLocaleDateString()}</TableCell>
              <TableCell><Link href={`/club_events/${club_event.id}`}>Edit</Link></TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </div>
       : (
        <p>No club_events found.</p>
      )}
      </>
  )
}


// club_events一覧を表示
export default async function ClubEvents() {  
  return (
    <div className="flex flex-col gap-4">
        
        

    <Suspense fallback={<div>Loading club_events...</div>}>
        <div className="flex flex-row gap-4 justify-end items-end mt-2">
            <AuthButton />
        </div>
        <Link className="flex items-center justify-center gap-4" href={`/`}><Button><Undo2/>Go back to Top</Button></Link>
                
        <EventsContent />
    </Suspense>
    </div>
  );
}