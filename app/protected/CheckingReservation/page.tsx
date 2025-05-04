import LangButton from "@/components/button";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const t = await getTranslations("HomePage");

  return (
    <div className="flex-1 w-full flex flex-col gap-8 px-4 py-6 max-w-screen-md mx-auto bg-white min-h-screen">
      {/* 상단 알림 영역 */}
      <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
        <InfoIcon size={16} strokeWidth={2} />
        {t("title")}
        <LangButton />
      </div>

      {/* 제목 */}
      <h1 className="text-center text-xl font-semibold">Checking reservation</h1>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-6">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
          >
            {/* 이미지 영역 */}
            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
              image
            </div>
            {/* 텍스트 영역 */}
            <div className="flex flex-col">
              <span className="text-base font-semibold">Festival name</span>
              <span className="text-sm text-gray-600">Team name</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
