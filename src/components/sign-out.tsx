
import { signOut } from "@/server/auth";

const SignOutButton = () => {
  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="inline-flex items-center rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Sign Out
      </button>
    </form>
  );
};

export default SignOutButton;
