import sendwelcomeEmails from "./sendwelcomeEmails"; // adjust the path

const req: any = {
  method: "POST",
  body: { email: "manolistsiftsis@gmail.com", username: "TestUser" },
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
  try {
    await sendwelcomeEmails(req, res);
  } catch (err) {
    console.error("Test failed:", err);
  }
})();
