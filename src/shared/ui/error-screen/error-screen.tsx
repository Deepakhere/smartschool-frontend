import { ArrowPathIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon, SparklesIcon } from "@heroicons/react/24/outline";

import { useEffect } from "react";

import { Button } from "@/shared/ui/kit/button";
import { isStaleBuildError, reloadForNewVersion } from "@/shared/lib/stale-build";

// what the person sees instead of a crash: what happened, how to get going again, and the details in development;
// inline fills the page area beside the sidebar instead of the whole screen
const ErrorScreen = ({ error, inline = false }: { error?: unknown; inline?: boolean }) => {
  const newVersion = isStaleBuildError(error);

  useEffect(() => {
    if (newVersion) reloadForNewVersion();
  }, [newVersion]);

  const Icon = newVersion ? SparklesIcon : ExclamationTriangleIcon;
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error ?? "");
  const stack = error instanceof Error ? error.stack : undefined;

  return (
    <div
      className={
        inline
          ? "flex min-h-[calc(100vh-12rem)] items-center justify-center"
          : "flex min-h-dvh items-center justify-center bg-gray-50 p-4"
      }
    >
      <div className="w-full max-w-xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4">
          <span
            className={`shrink-0 rounded-full p-2 ${newVersion ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {newVersion ? "A new version of Opscul is ready" : "Something went wrong"}
            </h1>
            <p className="text-sm text-gray-500">
              {newVersion
                ? "Opscul was updated while this page was open. Refresh to load the latest version."
                : "This page hit an unexpected problem. Your saved work is safe."}
            </p>
          </div>
        </div>

        {!newVersion && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>Refresh the page to try again</li>
            <li>Go back to the previous page and retry what you were doing</li>
            <li>If it keeps happening, contact Opscul support from the help icon</li>
          </ul>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          {!newVersion && (
            <Button variant="secondary" onClick={() => window.history.back()}>
              <ArrowUturnLeftIcon className="h-4 w-4" />
              Go back
            </Button>
          )}
          <Button onClick={() => window.location.reload()}>
            <ArrowPathIcon className="h-4 w-4" />
            Refresh page
          </Button>
        </div>

        {import.meta.env.DEV && message && (
          <details className="rounded-lg bg-gray-50 p-4 text-sm">
            <summary className="cursor-pointer font-medium text-gray-700">Technical details</summary>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-red-100 bg-red-50 p-3 text-xs text-red-800">
              {message}
            </pre>
            {stack && (
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md border border-gray-200 bg-white p-3 font-mono text-xs text-gray-700">
                {stack}
              </pre>
            )}
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorScreen;
