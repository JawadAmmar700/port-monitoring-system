"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertTriangle } from "lucide-react"

enum Error {
  Configuration = "Configuration",
  Unauthorized = "unauthorized",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem while trying to authenticate. Please contact us if this
      issue persists. Unique error code:{" "}
      <code className="rounded bg-gray-200 px-1 py-0.5 text-xs font-mono text-gray-800">
        Configuration
      </code>
    </p>
  ),
  [Error.Unauthorized]: (
    <p>
      User not authorized. Please contact the administrator to get access to the system.
    </p>
  ),
}

export default function AuthErrorPage() {
  const [mounted, setMounted] = useState(false)
  const search = useSearchParams()
  const error = search.get("error") as Error

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-gray-900 dark:text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-center">Authentication Error</h1>
          <p className="text-red-500 text-center">{error}</p>
          <div className="text-sm text-center text-gray-600 dark:text-gray-300">
            {errorMap[error] || "Please contact us if this error persists."}
          </div>
          <a
            href="/auth/signin"
            className="mt-4 inline-block rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600 dark:hover:bg-red-400 transition"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
