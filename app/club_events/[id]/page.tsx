import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import type { ClubEvent } from '@/types/types';
import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import ClubEventForm from "../update-event-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnCarouselForm from "../on_carousel-form";

// idにもとづいてレコードを取り出す
async function getClubEvent(id: number): Promise<ClubEvent | null> {
    const supabase = await createClient();
    const { data: club_event } = await supabase
      .from("club_events")
      .select()
      .eq("id", id)
      .single();
    return club_event as ClubEvent | null;
}

// 非同期コンポーネント
async function EventContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const club_event = await getClubEvent(Number(id));
    
    return (
        <div className="flex flex-col gap-4 justify-center items-center mb-8 pt-8">
            <Tabs defaultValue="Clubs" className="grid-cols-3 md:grid-cols-6">
                <TabsList className="">
                    <TabsTrigger value="Clubs">基本情報</TabsTrigger>
                    <TabsTrigger value="IsVerified">カルーセル掲載状況</TabsTrigger>
                </TabsList>
                <TabsContent value="Clubs" className="">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>基本情報</p>
                    <ClubEventForm club_event={club_event} />
                    </div>
                </TabsContent>
                <TabsContent value="IsVerified">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-lg mt-8">カルーセル掲載状況</p>
                    <OnCarouselForm event_id={Number(id)} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function ClubEventPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading club details...</div>}>
            <div className="flex flex-row gap-4 justify-end items-end mt-2">
                <AuthButton />
            </div>
            <Link className="flex items-center justify-center gap-4" href={`/club_events`}><Button><Undo2/>Go back to Clubs</Button></Link>
            <EventContent params={params} />
        </Suspense>
    );
}
