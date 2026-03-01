import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import DeleteBelongingButton from "./deleteBelonging-btn";
import AddBelongingForm from "./addBelonging-form";

// belongings
async function getBelongings() {
  const supabase = await createClient();
  const { data: belongings } = await supabase.from("belongings").select();

  return belongings;
}



// 非同期コンポーネント
async function BelongingsContent() {
  const belongings = await getBelongings();
  return (
    <>
    {belongings && belongings.length > 0 ? 
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

          {belongings.map((belonging) => (
            <TableRow key={belonging.id}>
              <TableCell>{belonging.id}</TableCell>
              <TableCell>{belonging.name}</TableCell>
              <TableCell>{new Date(belonging.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(belonging.updated_at).toLocaleDateString()}</TableCell>
              <TableCell><DeleteBelongingButton belongingId={belonging.id}/></TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </div>
       : (
        <p>No belongings found.</p>
      )}
    </>
)}

// belongings一覧を表示
export default function Belongings() {
  
  return (
    <div className="flex flex-col gap-4 mb-8">
        
        

    <Suspense fallback={<div>Loading belongings...</div>}>
        <div className="flex flex-row justify-end items-end gap-4 mt-2">
            <AuthButton />
        </div>
        <Link className="flex items-center justify-center gap-4" href={`/`}><Button><Undo2/>Go back to Top</Button></Link>
        <div className="flex justify-center items-center p-4"><AddBelongingForm /></div>
                
        <BelongingsContent />
    </Suspense>
    </div>
  );
}