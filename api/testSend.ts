import sendEmails from "./sendwelcomeEmails"; // adjust the path if needed

// Test data
const testEmail = "manolistsiftsis@gmail.com"; // replace with your inbox
const testUsername = "TestUser";

// Mock a Next.js request and response
const req: any = {
  method: "POST",
  body: { email: testEmail, username: testUsername },
};

const res: any = {
  status: (code: number) => {
    console.log("Response status:", code);
    return res;
  },
  json: (data: any) => {
    console.log("Response JSON:", data);
  },
};

(async () => {
  await sendEmails(req, res);
})();
