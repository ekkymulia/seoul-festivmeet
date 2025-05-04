import LangButton from "@/components/button";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import QuestionSteps from "./question-steps"; // 클라이언트 컴포넌트 분리

export default async function Customization_Settings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const t = await getTranslations("HomePage");

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <QuestionSteps />
    </div>
  );
}

