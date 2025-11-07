import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ManageAccountForm from "@/components/forms/auth--account-form";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <ManageAccountForm user={session.user} />;
};

export default page;
