"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteBelongingButton({ belongingId }: { belongingId: number }) {
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this belonging?")) {
      return;
    }

    try {
      const { error } = await supabase.from("belongings").delete().eq("id", belongingId);

      if (error) throw error;

      alert("Belonging deleted!");
      router.refresh(); // 削除後にサーバーのデータを再取得して画面を更新する
    } catch (error: any) {
      console.error("Error deleting belonging:", error);
      alert(`Error deleting the belonging: ${error.message || error}`);
    }
  }

  return <Button variant="destructive" onClick={handleDelete}>Delete</Button>;
}