import EventsFeed from "@/components/Events/EventsFeed";
import LangButton from "@/components/button";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function ReservationPage() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const t = await getTranslations('HomePage');

  return (
    <div className="flex flex-col px-4 pt-6 pb-6 gap-4">
      <EventsFeed />
    </div>
  );
}
