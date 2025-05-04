import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProfileForm from "@/components/account/profileForm";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const t = await getTranslations('HomePage');

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <ProfileForm userId={user.id} />
    </div>
  );
}