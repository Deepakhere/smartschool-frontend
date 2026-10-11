import * as React from "react";

import { cn } from "@/lib/utils";

// a grey placeholder block shaped like the content that's loading, so the page
// doesn't jump once data arrives and layout stays stable while it's waited on
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />
);

export { Skeleton };
