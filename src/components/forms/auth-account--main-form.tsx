import {
  AuthCard,
  AuthContent,
  AuthHeader,
  AuthSeparator,
} from "@/components/forms/auth--form-ui";

import type { User } from "better-auth";
import AccountLogout from "../auth--logout";
import AccountProfileForm from "./auth-account--profile-form";
import AccountChangePassword from "./auth-account--change-password-form";

export default function ManageAccountForm({ user }: { user: User }) {
  return (
    <AuthCard>
      <AuthHeader title="Manage your account" />
      <AuthContent>
        <AccountProfileForm user={user} />
        <AuthSeparator className="pt-5 pb-3" />
        <h3 className="text-sm font-medium">Change password</h3>
        <p className="text-sm text-muted-foreground">
          Leave empty to keep your current password.
        </p>
        <AccountChangePassword />
        <AuthSeparator className="pt-5 pb-3" />
        <AccountLogout />
      </AuthContent>
    </AuthCard>
  );
}
