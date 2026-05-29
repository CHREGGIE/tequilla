import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAdminEmails(): Promise<string[]> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data);
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const adminEmails = await getAdminEmails();
  const email = user.email?.toLowerCase() ?? "";
  const emailAllowed = adminEmails.includes(email);
  const dbAdmin = await isAdminUser(user.id);

  if (!emailAllowed && !dbAdmin) redirect("/");

  return { user, supabase };
}

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const adminEmails = await getAdminEmails();
  const email = user.email?.toLowerCase() ?? "";
  if (adminEmails.includes(email)) return true;
  return isAdminUser(user.id);
}
