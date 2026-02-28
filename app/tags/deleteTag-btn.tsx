"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteTagButton({ tagId }: { tagId: number }) {
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    try {
      const { error } = await supabase.from("tags").delete().eq("id", tagId);

      if (error) throw error;

      alert("Tag deleted!");
      router.refresh(); // 削除後にサーバーのデータを再取得して画面を更新する
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      alert(`Error deleting the tag: ${error.message || error}`);
    }
  }

  return <Button variant="destructive" onClick={handleDelete}>Delete</Button>;
}