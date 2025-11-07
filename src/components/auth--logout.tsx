"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { Loader2 } from "lucide-react";
import React from "react";

const AccountLogout = () => {
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
        },
      });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-[17px] font-semibold">Be Cautious</h3>
      <p className="text-sm text-neutral-400">
        Logging out will sign you out from this website.
      </p>
      <Button
        className="mt-4"
        variant="destructive"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Logging Out...
          </>
        ) : (
          "Log Out"
        )}
      </Button>
    </div>
  );
};

export default AccountLogout;
