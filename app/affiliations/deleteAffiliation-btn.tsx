"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteAffiliationButton({ affiliationId }: { affiliationId: number }) {
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this affiliation?")) {
      return;
    }

    try {
      const { error } = await supabase.from("club_affiliations").delete().eq("id", affiliationId);

      if (error) throw error;

      alert("Affiliation deleted!");
      router.refresh(); // 削除後にサーバーのデータを再取得して画面を更新する
    } catch (error: any) {
      console.error("Error deleting affiliation:", error);
      alert(`Error deleting the affiliation: ${error.message || error}`);
    }
  }

  return <Button variant="destructive" onClick={handleDelete}>Delete</Button>;
}