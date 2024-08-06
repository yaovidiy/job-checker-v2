import mailjet from "$lib/server/mailjet";
import { json, error } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
  try {
    const { email } = await request.json();
    const emailRequest = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "saas@kit.com",
              Name: "Your SaaS Kit"
            },
            To: [
              {
                Email: email
              }
            ],
            Subject: "Verify your email address",
            TextPart: "Click the link below to verify your email address",
            HTMLPart: `<a href="https://example.com/verify-email/${email}">Verify your email address</a>`
          }
        ]
      });

    console.log(emailRequest.body);

    return json({ message: "Email sent" });
  } catch (err) {
    console.error(err);
    return error(500, { message: "Error sending email" });
  }
}