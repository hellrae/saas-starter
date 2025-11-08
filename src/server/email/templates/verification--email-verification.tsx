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

// General-purpose email verification template
export const EmailVerification = ({
  name,
  email,
  verificationUrl,
}: {
  name: string;
  email: string;
  verificationUrl: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your email address</Preview>
        <Body
          className="font-sans py-10 bg-gray-50"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <Container className="bg-white max-w-[500px] mx-auto p-10 rounded-xl shadow-sm">
            <Section className="mb-8">
              <Text className="text-3xl font-semibold text-gray-900 m-0 mb-4">
                Verify your email address
              </Text>

              <Text className="text-base text-gray-700 m-0 mb-4">
                Hi {name}, please confirm that you own the email{" "}
                <span className="font-medium">{email}</span> by clicking the
                button below.
              </Text>

              <Text className="text-base text-gray-700 m-0 mb-4">
                This helps us confirm your identity and keep your account
                secure. If you didn’t request this verification, you can safely
                ignore this message.
              </Text>

              <Section className="mt-8 mb-6 text-center">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base no-underline inline-block"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-sm text-gray-600 m-0 mb-6 leading-5">
                Or copy this link into your browser:
                <br />
                <Link
                  href={verificationUrl}
                  className="text-blue-600 break-all"
                >
                  {verificationUrl}
                </Link>
              </Text>

              <Text className="text-sm text-gray-600 m-0">
                This link will expire in 24 hours for security reasons.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 pt-4 mt-8">
              <Text className="text-xs text-gray-500 m-0 text-center">
                © 2025 {appSeo.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerification.PreviewProps = {
  name: "Alex",
  email: "alex@example.com",
  verificationUrl: "https://yourapp.com/verify?token=verify123",
};

export default EmailVerification;
