import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from "@clerk/clerk-react";

export default function ForgotPasswordFlow() {
  const { signIn } = useSignIn();
  const clerk = useClerk();

  const navigate = useNavigate();

  const [signInObj, setSignInObj] = useState(null);
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        const newSignIn = await signIn.create({
          identifier: email,
          strategy: 'reset_password_email_code',
        });
        setSignInObj(newSignIn);
        setStep(2);
      } else if (step === 2) {
        if (password !== confirm) {
          setLoading(false);
          alert("Passwords don't match");
          return;
        }

        const result = await signInObj.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password,
        });

        if (result.status === 'complete') {
  // Set the new session as active
  await clerk.setActive({ session: result.createdSessionId });

  // Redirect to your dashboard
  navigate('/dashboard'); // 👈 replace with your actual dashboard route
} else {
  alert('Verification failed. Please try again.');
}

      }
    } catch (err) {
      console.error(err);
      alert(err.errors?.[0]?.message || 'Something went wrong.');
    }

    setLoading(false);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
          required
        />
      );
    }

    if (step === 2) {
      return (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
            required
          />

          {/* New Password */}
          <div className="relative mt-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 pr-12"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-xl"
              role="button"
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative mt-4">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 pr-12"
              required
            />
            <span
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-xl"
              role="button"
            >
              {showConfirm ? '👁️' : '🙈'}
            </span>
          </div>
        </>
      );
    }
  };

  const title =
    step === 1 ? 'Forgot Password' : 'Verify Code & Reset Password';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{title}</h2>
        <form onSubmit={handleNext} className="space-y-4">
          {renderStep()}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Please wait...' : step === 2 ? 'Reset Password' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  );
}
