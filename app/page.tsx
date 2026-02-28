import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>金沢サークルハブ管理者サイト</Link>
              <div className="flex items-center gap-2">
                
              </div>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <p className="">これは金沢サークルハブ管理者サイトです。団体代表者の方は<a className="text-blue-500 hover:underline" href="https://kanazawa-circle-hub.vercel.app/login" target="_blank" rel="noopener noreferrer">こちら</a>からお入りください。</p>
          </main>
          <div className="flex items-center gap-2 text-sm md:gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-medium"><Link href={"/clubs"}>サークル一覧</Link></span>
              <span className="text-muted-foreground text-xs">
                掲載中の団体情報の確認・編集
              </span>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-1">
              <span className="font-medium"><Link href={"/club_events"}>サークルイベント一覧</Link></span>
              <span className="text-muted-foreground text-xs">
                イベント情報の確認・編集、カルーセル広告の管理
              </span>
            </div>
            <Separator orientation="vertical" className="hidden md:block" />
            <div className="hidden flex-col gap-1 md:flex">
              <span className="font-medium"><Link href={"/tags"}>タグ一覧</Link></span>
              <span className="text-muted-foreground text-xs">検索ページのタグ管理</span>
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            &copy; 2026 Kanazawa Circle Hub. All rights reserved.
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
  }