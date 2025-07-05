export const checkUsernameAvailability = async (
  usernameToCheck: string
): Promise<"available" | "taken" | "error"> => {
  if (!usernameToCheck) return "available";

  // Only run in production (skip for development/testing)
  if (import.meta.env.MODE !== "production") {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          ["admin", "manolis-2008", "testuser"].includes(usernameToCheck.toLowerCase())
        ) {
          resolve("taken");
        } else {
          resolve("available");
        }
      }, 400);
    });
  }

  try {
    const res = await fetch(
      `https://api.clerk.com/v1/users?username=${encodeURIComponent(usernameToCheck)}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_CLERK_SECRET_KEY}`, // ✅ Store this securely
        },
      }
    );

    const users = await res.json();
    if (Array.isArray(users) && users.length > 0) return "taken";
    return "available";
  } catch (err) {
    console.error("Clerk username check error:", err);
    return "error";
  }
};
