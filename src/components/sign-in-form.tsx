import { signIn } from "@/server/auth";
import { redirect } from "next/navigation";

export function SignInForm() {
  return (
    <div className="mt-8">
      <form
        action={async (formData) => {
          "use server";
            const result = await signIn("nodemailer", formData);
            if(!result){    
              const errorMessage = encodeURIComponent("unauthorized");
              redirect(`/auth/error?error=${errorMessage}`);
            }
        }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send magic link
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-500">
              Check your email
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 