import { Suspense } from "react";
import LoginPage from "./login-page";

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center text-muted">Loading…</div>}>
      <LoginPage />
    </Suspense>
  );
}
