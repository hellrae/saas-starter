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

const EmailChangeVerification = ({
  name,
  oldEmail,
  newEmail,
  verificationUrl,
}: {
  name: string;
  oldEmail: string;
  newEmail: string;
  verificationUrl: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your new email address</Preview>
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
                Your email address has been changed from{" "}
                <span className="font-medium">{oldEmail}</span> to{" "}
                <span className="font-medium">{newEmail}</span>.
              </Text>
              <Text className="text-4 text-gray-700 m-0 mb-6">
                Click the button below to verify your new email address and
                complete the change.
              </Text>

              <Section className="mb-6">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-6 py-3 rounded-[6px] text-4 no-underline box-border inline-block"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  Verify New Email
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 m-0 leading-5">
                Or copy this link:
                <br />
                <Link href={verificationUrl}>{verificationUrl}</Link>
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

EmailChangeVerification.PreviewProps = {
  name: "Alex",
  oldEmail: "alex.old@example.com",
  newEmail: "alex.new@example.com",
  verificationUrl: "https://yourapp.com/verify-email-change?token=abc123xyz789",
};

export default EmailChangeVerification;
