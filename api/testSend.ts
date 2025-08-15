import sendEmails from "./sendwelcomeEmails";
import { NextApiRequest, NextApiResponse } from "next";

// Mock request and response
const req = {
  method: "POST",
  body: {
    email: "manolistsiftsis@gmail.com.com",
    username: "TestUser",
  },
} as NextApiRequest;

const res = {
  status: function (code: number) {
    console.log("Status code:", code);
    return this;
  },
  json: function (data: any) {
    console.log("Response JSON:", data);
    return this;
  },
} as unknown as NextApiResponse;

// Call the function
sendEmails(req, res);
