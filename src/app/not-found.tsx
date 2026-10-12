import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

// Server wrapper so the 404 gets its own title (an inline <title> in the client view loses to the root metadata).
export const metadata: Metadata = {
  title: "404 — Not found | KRISHI.OS",
};

export default function NotFound() {
  return <NotFoundView />;
}
