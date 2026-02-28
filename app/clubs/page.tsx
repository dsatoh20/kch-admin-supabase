import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Undo2, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getVerifiedClubIDs } from "./getIsVerified";

async function ClubsData(sort: string, order: string) {
  const supabase = await createClient();
  const { data: clubs } = await supabase
    .from("clubs")
    .select()
    .order(sort, { ascending: order === 'asc' });

  return clubs;
}

// 非同期コンポーネント
async function ClubsContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const searchkeys = await searchParams;
  const sort = (searchkeys?.sort as string) || 'id';
  const order = (searchkeys?.order as string) || 'asc';
  const clubs = await ClubsData(sort, order);
  const verifiedClubIds = await getVerifiedClubIDs() || [];

  // clubsの各レコードにis_verifiedフィールドを追加
  const clubsWithVerified = clubs?.map(club => ({
    ...club,
    is_verified: verifiedClubIds.some((vcid: { club_id: number }) => vcid.club_id === club.id)
  }));

  return (
    <>
    {clubs && clubs.length > 0 ? 
        <div className="mx-auto p-4">
        <p className="text-lg mt-8 text-center">サークル一覧</p>
        <Table className="w-full my-8">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Link href={`/clubs?sort=id&order=${sort === 'id' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                  ID
                  {sort === 'id' && (order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={`/clubs?sort=name&order=${sort === 'name' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                  Name
                  {sort === 'name' && (order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={`/clubs?sort=slug&order=${sort === 'slug' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                  Slug
                  {sort === 'slug' && (order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={`/clubs?sort=is_verified&order=${sort === 'is_verified' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                  IsVerified
                  {sort === 'is_verified' && (order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={`/clubs?sort=created_at&order=${sort === 'created_at' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                  CreatedAt
                  {sort === 'created_at' && (order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                </Link>
              </TableHead>
              <TableHead>
                <Link href={`/clubs?sort=updated_at&order=${sort === 'updated_at' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                  UpdatedAt
                  {sort === 'updated_at' && (order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                </Link>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          {clubsWithVerified?.map((club) => (
            <TableRow key={club.id}>
              <TableCell>{club.id}</TableCell>
              <TableCell>{club.name}</TableCell>
              <TableCell>{club.slug}</TableCell>
              <TableCell>{club.is_verified ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(club.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(club.updated_at).toLocaleDateString()}</TableCell>
              <TableCell><a href={`/clubs/${club.slug}`}>Edit</a></TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </div>
       : (
        <p>No clubs found.</p>
      )}
    </>
  )
}

// clubs一覧を表示
export default  function Clubs({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  return (
    <Suspense fallback={<div>Loading clubs...</div>}>
      <div className="flex flex-row gap-4 justify-end items-end mt-2">
          <AuthButton />
      </div>
      <Link className="flex items-center justify-center gap-4" href={`/`}><Button><Undo2/>Go back to Top</Button></Link>
              
      <ClubsContent searchParams={searchParams} />
    </Suspense>
  );
}