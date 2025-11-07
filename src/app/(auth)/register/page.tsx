import RegisterForm from "@/components/forms/auth--register-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <RegisterForm />;
  redirect("/account");
};

export default page;
