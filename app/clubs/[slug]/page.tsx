import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import ClubForm from "../forms/club-form";
import type { Club, Tag } from '@/types/types';
import ClubInfoForm from "../forms/club_infos-form";
import UrlsForm from "../forms/urls-form";
import MemberCompositionForm from "../forms/member_composition-form";
import ClubTagsForm from "../forms/club_tags-form";
import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import getClubAffiliation from "../getClubAffiliation";
import getTags from "../getTags";
import IsVerifiedForm from "../forms/is_verified-form";

// slugにもとづいてレコードを取り出す
async function getClub(slug: string): Promise<Club | null> {
    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select()
      .eq("slug", slug)
      .single();
    return club as Club | null;
}

// 非同期コンポーネント
async function ClubContent({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    const club = await getClub(slug);
    const clubAffiliations = await getClubAffiliation() || [];
    const tags: Tag[] = await getTags() || [];
    return(
        <div className="flex flex-col gap-4 justify-center items-center mb-8">
            <p className='text-lg mt-8'>サークル基本情報</p>
            <ClubForm club={club} clubAffiliations={clubAffiliations} />
            <p className="text-lg mt-8">金沢サークルハブ公認</p>
            <IsVerifiedForm club_id={club?.id || null} />
            <p className='text-lg mt-8'>サークル詳細情報</p>
            <ClubInfoForm club_id={club?.id || null} />
            <p className='text-lg mt-8'>サークルリンク</p>
            <UrlsForm club_id={club?.id || null} />
            <p className='text-lg mt-8'>サークル構成員</p>
            <MemberCompositionForm club_id={club?.id || null} />
            <p className='text-lg mt-8'>サークルタグ</p>
            <ClubTagsForm club_id={club?.id || null} tags={tags} />
        </div>
    )
}


export default function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  
    return (
        <Suspense fallback={<div>Loading club details...</div>}>
            <div className="flex flex-row gap-4 justify-end items-end mt-2">
                <AuthButton />
            </div>
            <Link className="flex items-center justify-center gap-4" href={`/clubs`}><Button><Undo2/>Go back to Clubs</Button></Link>
            <ClubContent params={params} />
        </Suspense>
    );
}
