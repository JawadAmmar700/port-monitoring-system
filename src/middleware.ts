import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define routes that are restricted for employees
const employeeRestrictedRoutes = {
  "/dashboard/environmental": ["MANAGER"],
  "/dashboard/sensors": ["MANAGER"],
};

// Define routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/unauthorized",
  "/auth/error",
  "/auth/verify-request",
  "/auth/signout",
  "/auth/callback",
  "/auth/session",
  "/auth/csrf",
  "/auth/providers",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute =
    publicRoutes.some((route) => pathname === route) ||
    pathname.startsWith("/auth/");

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || "",
    secureCookie: process.env.NODE_ENV === "production" ? true : false,
  });

  console.log("token", token);

  // If not authenticated and not on a public route, redirect to sign-in
  if (!token && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated
  if (token) {
    // If user is a MANAGER, allow access to all routes
    if (token.type === "MANAGER") {
      return NextResponse.next();
    }

    // If user is an Employee
    if (token.type === "EMPLOYEE") {
      // Check if trying to access a restricted route
      const isRestrictedRoute = Object.keys(employeeRestrictedRoutes).some(
        (route) => pathname.startsWith(route)
      );

      // If trying to access a restricted route, return unauthorized response
      if (isRestrictedRoute) {
        const response = NextResponse.next();
        response.headers.set("x-unauthorized", "true");
        return response;
      }

      // Allow access to all other routes
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
