import { appSeo } from "@/lib/utils/seo";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

// sent to the new email confirming that the email has been verified
export const EmailVerifiedNotification = ({
  name,
  newEmail,
  profileUrl,
}: {
  name: string;
  newEmail: string;
  profileUrl?: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your email address is now verified</Preview>
        <Body
          className="font-sans py-10"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <Container className="bg-white max-w-[500px] mx-auto p-10">
            <Section className="mb-8">
              <Text className="text-4 text-gray-900 m-0 mb-4">Hey {name},</Text>

              <Text className="text-4 text-gray-700 m-0 mb-4">
                Good news. The email{" "}
                <span className="font-medium">{newEmail}</span> has been
                verified and is now associated with your account.
              </Text>

              {profileUrl ? (
                <Text className="text-4 text-gray-700 m-0 mb-6">
                  You can review your account settings here:{" "}
                  <Link href={profileUrl}>{profileUrl}</Link>
                </Text>
              ) : null}

              <Text className="text-4 text-gray-700 m-0 mb-6">
                If you did not perform this action, please contact our support
                team immediately.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 pt-4">
              <Text className="text-3 text-gray-500 m-0">
                © 2025 {appSeo.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerifiedNotification.PreviewProps = {
  name: "Alex",
  newEmail: "alex.new@example.com",
  profileUrl: "https://yourapp.com/account/settings",
};
