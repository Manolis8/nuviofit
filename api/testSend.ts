import fetch from "node-fetch"; // Only needed if running in Node < 18

async function testSend() {
  const response = await fetch("https://www.nuviofit.com/api/sendwelcomeEmails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "manolistsiftsis@gmail.com",
      username: "TestUser",
    }),
  });

  const data = await response.json();
  console.log("Response:", data);
}

testSend().catch(console.error);
