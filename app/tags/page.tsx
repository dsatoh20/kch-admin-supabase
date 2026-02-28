import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import AddTagForm from "./addTag-form";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import DeleteTagButton from "./deleteTag-btn";

// tag一覧を取得
async function getTags() {
  const supabase = await createClient();
  const { data: tags } = await supabase.from("tags").select();

  return tags;
}

// tagを使用する団体数を取得する
async function getTagUsageCount(tagId: number) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("club_tags")
      .select("*", { count: "exact", head: true })
      .eq("tag_id", tagId);
  
    return count || 0;
}



// 非同期コンポーネント
async function TagsContent() {
  const tags = await getTags();
  return (
    <>
    {tags && tags.length > 0 ? 
        <div className="mx-auto p-4">
        <p className="text-lg mt-8 text-center">タグ一覧</p>
        <Table className="w-full my-8">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>UsageCount</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>UpdatedAt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{getTagUsageCount(tag.id)}</TableCell>
              <TableCell>{new Date(tag.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(tag.updated_at).toLocaleDateString()}</TableCell>
              <TableCell><DeleteTagButton tagId={tag.id}/></TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </div>
       : (
        <p>No tags found.</p>
      )}
    </>
)}

// tags一覧を表示
export default function Tags() {
  
  return (
    <div className="flex flex-col gap-4 mb-8">
        
        

    <Suspense fallback={<div>Loading tags...</div>}>
        <div className="flex flex-row justify-end items-end gap-4 mt-2">
            <AuthButton />
        </div>
        <Link className="flex items-center justify-center gap-4" href={`/`}><Button><Undo2/>Go back to Top</Button></Link>
        <div className="flex justify-center items-center p-4"><AddTagForm /></div>
                
        <TagsContent />
    </Suspense>
    </div>
  );
}