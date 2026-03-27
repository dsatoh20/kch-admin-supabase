import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

async function getRequests() {
  const supabase = await createClient();

  const { data: requests, error: requestsError } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (requestsError) {
    console.error("Error fetching requests:", requestsError);
    return [];
  }

  const clubEventIds = [...new Set(requests.map((r) => r.club_event_id).filter(Boolean))];

  const { data: clubEvents, error: clubEventsError } = await supabase
    .from("club_events")
    .select("id, club_name, description")
    .in("id", clubEventIds);

  if (clubEventsError) {
    console.error("Error fetching club_events:", clubEventsError);
    return [];
  }

  const clubEventMap = new Map(clubEvents.map((e) => [e.id, e]));

  return requests.map((r) => ({
    ...r,
    club_event: clubEventMap.get(r.club_event_id) ?? null,
  }));
}

async function RequestsContent() {
  const requests = await getRequests();

  return (
    <>
      {requests && requests.length > 0 ? (
        <div className="mx-auto p-4">
          <p className="text-lg mt-8 text-center">リクエスト一覧</p>
          <Table className="w-full my-8">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ClubName</TableHead>
                <TableHead>EventDescription</TableHead>
                <TableHead>Context</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CreatedAt</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.club_event?.club_name ?? request.club_id}</TableCell>
                  <TableCell>{request.club_event?.description ?? request.club_event_id}</TableCell>
                  <TableCell>{request.context}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {request.club_event_id && (
                      <Link href={`/club_events/${request.club_event_id}`}>Edit</Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No requests found.</p>
      )}
    </>
  );
}

export default async function Requests() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div>Loading requests...</div>}>
        <div className="flex flex-row gap-4 justify-end items-end mt-2">
          <AuthButton />
        </div>
        <Link className="flex items-center justify-center gap-4" href={`/`}>
          <Button><Undo2 />Go back to Top</Button>
        </Link>
        <RequestsContent />
      </Suspense>
    </div>
  );
}
