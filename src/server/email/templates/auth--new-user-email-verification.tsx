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

const NewUserEmailVerification = ({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome! Let's verify your email to get started</Preview>
        <Body
          className="font-sans py-10"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <Container className="bg-white max-w-[500px] mx-auto p-10">
            <Section className="mb-8">
              <Text className="text-4 text-gray-900 m-0 mb-4">
                Welcome {name}!
              </Text>
              <Text className="text-4 text-gray-700 m-0 mb-6">
                You're just one step away from accessing your new account. Click
                below to verify your email and start exploring.
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
                  Verify & Get Started
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

NewUserEmailVerification.PreviewProps = {
  name: "Alex",
  verificationUrl: "https://yourapp.com/verify-email?token=abc123xyz789",
};

export default NewUserEmailVerification;
