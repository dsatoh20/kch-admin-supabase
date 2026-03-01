import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import ClubForm from "../forms/club-form";
import type { Belonging, Club, Tag } from '@/types/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberCompositionBelongingsForm from "../forms/member_composition_belongings-form";
import getBelongings from "../getBelongings";

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

    const [club, clubAffiliationsData, tagsData, belongingsData] = await Promise.all([
        getClub(slug),
        getClubAffiliation(),
        getTags(),
        getBelongings()
    ]);
    const clubAffiliations = clubAffiliationsData || [];
    const tags: Tag[] = tagsData || [];
    const belongings: Belonging[] = belongingsData || [];
    return(
        <div className="flex flex-col gap-4 justify-center items-center mb-8 pt-8">
            <Tabs defaultValue="Clubs" className="grid-cols-3 md:grid-cols-6">
                <TabsList className="">
                    <TabsTrigger value="Clubs">基本情報</TabsTrigger>
                    <TabsTrigger value="IsVerified">承認状況</TabsTrigger>
                    <TabsTrigger value="ClubInfos">詳細情報</TabsTrigger>
                    <TabsTrigger value="Urls">リンク</TabsTrigger>
                    <TabsTrigger value="MemberComposition">メンバー構成1</TabsTrigger>
                    <TabsTrigger value="MemberComposition2">メンバー構成2</TabsTrigger>
                    <TabsTrigger value="ClubTags">タグ</TabsTrigger>
                </TabsList>
                <TabsContent value="Clubs" className="">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>基本情報</p>
                    <ClubForm club={club} clubAffiliations={clubAffiliations} />
                    </div>
                </TabsContent>
                <TabsContent value="IsVerified">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-lg mt-8">承認状況</p>
                    <IsVerifiedForm club_id={club?.id || null} />
                    </div>
                </TabsContent>
                <TabsContent value="ClubInfos">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>詳細情報</p>
                    <ClubInfoForm club_id={club?.id || null} />
                    </div>
                </TabsContent>
                <TabsContent value="Urls">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>リンク</p>
                    <UrlsForm club_id={club?.id || null} />
                    </div>
                </TabsContent>
                <TabsContent value="MemberComposition">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>メンバー構成1</p>
                    <MemberCompositionForm club_id={club?.id || null} />
                    </div>
                </TabsContent>

                <TabsContent value="MemberComposition2">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>メンバー構成2</p>
                    <MemberCompositionBelongingsForm club_id={club?.id || null} belongings={belongings || null} />
                    </div>
                </TabsContent>

                <TabsContent value="ClubTags">
                    <div className="flex flex-col justify-center items-center gap-4">
                    <p className='text-lg mt-8'>サークルタグ</p>
                    <ClubTagsForm club_id={club?.id || null} tags={tags} />
                    </div>
                </TabsContent>
            </Tabs>
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
