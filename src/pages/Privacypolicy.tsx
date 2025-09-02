import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Effective Date: 13/07/2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Who We Are</h2>
      <p className="mb-4">
        Nuviofit provides personalized fitness and motivation services through our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. What Data We Collect</h2>
      <p className="mb-2">When you sign up, we collect:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Email address</li>
        <li>Password</li>
        <li>Responses to questions about fitness goals, motivation, personality, and preferences</li>
      </ul>
      <p className="mb-4">
        We also collect technical data such as IP address, browser type, and usage behavior through cookies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Data</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To create and maintain your personalized fitness dashboard</li>
        <li>To communicate with you (e.g., updates, account issues)</li>
        <li>To improve our services</li>
        <li>For security and fraud prevention</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. How We Store Your Data</h2>
      <p className="mb-4">
        Your data is stored securely on servers in accordance with industry standards. Passwords are encrypted.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. How We Share Your Data</h2>
      <p className="mb-4">
        We do not sell your data. We may share it with trusted service providers only to run our platform (hosting, analytics, etc.).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        Depending on your country, you have the right to access, correct, or delete your data. Contact us at contact@nuviofit.com.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Cookies</h2>
      <p className="mb-4">
        We use cookies to improve functionality and user experience. By using our site, you consent to cookies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this policy. If we do, we’ll notify you by email or through your dashboard.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
