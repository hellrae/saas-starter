import LoginForm from "@/components/forms/auth--login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <LoginForm />;
  redirect("/account");
};

export default page;
