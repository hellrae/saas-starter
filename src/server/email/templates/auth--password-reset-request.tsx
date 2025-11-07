import { appSeo } from "@/lib/utils/seo";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

const PasswordResetRequest = ({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - we've got you covered</Preview>
        <Body
          className="font-sans py-10"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <Container className="bg-white max-w-[500px] mx-auto p-10">
            <Section className="mb-8">
              <Text className="text-4 text-gray-900 m-0 mb-4">Hi {name},</Text>
              <Text className="text-4 text-gray-700 m-0 mb-4">
                No worries! We received a request to reset your password.
              </Text>
              <Text className="text-4 text-gray-700 m-0 mb-6">
                Click the button below to create a new password and get back to
                your account.
              </Text>

              <Section className="mb-6">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-6 py-3 rounded-[6px] text-4 no-underline box-border inline-block"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 m-0 mb-4 leading-5">
                Or copy this link:
                <br />
                <Link href={resetUrl}>{resetUrl}</Link>
              </Text>

              <Text className="text-[14px] text-gray-600 m-0 leading-5">
                If you didn't request this password reset, you can safely ignore
                this email. Your password will remain unchanged.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 pt-4">
              <Text className="text-3 text-gray-500 m-0">
                © 2025 ${appSeo.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordResetRequest.PreviewProps = {
  name: "Alex",
  resetUrl: "https://yourapp.com/reset-password?token=abc123xyz789",
};

export default PasswordResetRequest;
