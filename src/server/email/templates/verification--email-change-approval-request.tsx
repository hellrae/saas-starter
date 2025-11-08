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

// sent to the user's current email asking them to approve the change to a new email
export const EmailChangeApprovalRequest = ({
  name,
  currentEmail,
  requestedEmail,
  approvalUrl,
}: {
  name: string;
  currentEmail: string;
  requestedEmail: string;
  approvalUrl: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Approve change of your account email</Preview>
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
                We received a request to change the email for your account from
                <span className="font-medium"> {currentEmail} </span> to
                <span className="font-medium"> {requestedEmail}</span>.
              </Text>

              <Text className="text-4 text-gray-700 m-0 mb-4">
                If you initiated this change, click the button below to approve
                it. If you did not request this, you can ignore this email or
                contact support.
              </Text>

              <Section className="mb-6">
                <Button
                  href={approvalUrl}
                  className="bg-blue-600 text-white px-6 py-3 rounded-[6px] text-4 no-underline box-border inline-block"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  Approve Email Change
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 m-0 leading-5">
                Or copy this link:
                <br />
                <Link href={approvalUrl}>{approvalUrl}</Link>
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

EmailChangeApprovalRequest.PreviewProps = {
  name: "Alex",
  currentEmail: "alex.current@example.com",
  requestedEmail: "alex.new@example.com",
  approvalUrl: "https://yourapp.com/approve-email-change?token=approve123",
};
