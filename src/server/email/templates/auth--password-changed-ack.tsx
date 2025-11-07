import { appSeo } from "@/lib/utils/seo";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

const PasswordChangedAck = ({ name }: { name: string }) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your password has been changed successfully</Preview>
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
                Your password has been successfully changed.
              </Text>
              <Text className="text-4 text-gray-700 m-0 mb-6">
                Your account is now secure with your new password. You can
                continue using your account as normal.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 pt-4">
              <Text className="text-[12px] text-gray-500 m-0">
                © 2025 ${appSeo.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordChangedAck.PreviewProps = {
  name: "Alex",
};

export default PasswordChangedAck;
