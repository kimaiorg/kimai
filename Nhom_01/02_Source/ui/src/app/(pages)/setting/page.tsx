"use client";

import SettingsLayout from "@/app/(pages)/setting/setting-layout";
import TimeTrackingSettings from "@/app/(pages)/setting/time-tracking-settings";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

export function SettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold pb-3">Settings</h1>
      <SettingsLayout>
        <TimeTrackingSettings />
      </SettingsLayout>
    </>
  );
}
export default AuthenticatedRoute(SettingsPage, []);
