import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import DeleteAffiliationButton from "./deleteAffiliation-btn";
import AddAffiliationForm from "./addAffiliation-form";

// belongings
async function getAffiliations() {
  const supabase = await createClient();
  const { data: affiliations } = await supabase.from("club_affiliations").select();

  return affiliations;
}



// 非同期コンポーネント
async function AffiliationsContent() {
  const affiliations = await getAffiliations();
  return (
    <>
    {affiliations && affiliations.length > 0 ? 
        <div className="mx-auto p-4">
        <p className="text-lg mt-8 text-center">構成員所属一覧</p>
        <Table className="w-full my-8">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>UpdatedAt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          {affiliations.map((affiliation) => (
            <TableRow key={affiliation.id}>
              <TableCell>{affiliation.id}</TableCell>
              <TableCell>{affiliation.name}</TableCell>
              <TableCell>{new Date(affiliation.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(affiliation.updated_at).toLocaleDateString()}</TableCell>
              <TableCell><DeleteAffiliationButton affiliationId={affiliation.id}/></TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </div>
       : (
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