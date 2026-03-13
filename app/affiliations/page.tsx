import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import DeleteAffiliationButton from "./deleteAffiliation-btn";
import AddAffiliationForm from "./addAffiliation-form";

// affiliationの一覧と、それぞれに紐づくclubの数を取得する
async function getAffiliationsWithCount() {
  const supabase = await createClient();
  // `clubs(count)` という構文で関連するclubsテーブルの行数をカウントします。
  // これを利用するには、Supabase上で`clubs.club_affiliation_id`から`club_affiliations.id`への
  // 外部キーリレーションが設定されている必要があります。
  const { data: affiliations, error } = await supabase
    .from("club_affiliations")
    .select("*, clubs(count)");

  if (error) {
    console.error("Error fetching affiliations with count:", error);
    return [];
  }

  // dataは { ..., clubs: [{ count: 10 }] } のような形になるため、扱いやすいように整形します。
  return affiliations.map((aff) => ({
    ...aff,
    club_count: Array.isArray(aff.clubs) ? aff.clubs[0]?.count ?? 0 : 0,
  }));
}

// 非同期コンポーネント
async function AffiliationsContent() {
  const affiliationsWithCount = await getAffiliationsWithCount();
  return (
    <>
    {affiliationsWithCount && affiliationsWithCount.length > 0 ? (
        <div className="mx-auto p-4">
        <p className="text-lg mt-8 text-center">構成員所属一覧</p>
        <Table className="w-full my-8">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ClubCount</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          {affiliationsWithCount.map((affiliation) => (
            <TableRow key={affiliation.id}>
              <TableCell>{affiliation.id}</TableCell>
              <TableCell>{affiliation.name}</TableCell>
              <TableCell>{affiliation.club_count}</TableCell>
              <TableCell>{new Date(affiliation.created_at).toLocaleDateString()}</TableCell>
              <TableCell><DeleteAffiliationButton affiliationId={affiliation.id}/></TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </div>
      ) : (
        <p>No affiliations found.</p>
      )}
    </>
)}

// affiliations一覧を表示
export default function Affiliations() {
  
  return (
    <div className="flex flex-col gap-4 mb-8">
        
        

    <Suspense fallback={<div>Loading affiliations...</div>}>
        <div className="flex flex-row justify-end items-end gap-4 mt-2">
            <AuthButton />
        </div>
        <Link className="flex items-center justify-center gap-4" href={`/`}><Button><Undo2/>Go back to Top</Button></Link>
        <div className="flex justify-center items-center p-4"><AddAffiliationForm /></div>
                
        <AffiliationsContent />
    </Suspense>
    </div>
  );
}