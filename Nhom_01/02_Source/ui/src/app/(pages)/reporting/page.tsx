"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  UserIcon,
  UsersIcon,
  FolderIcon,
  ArchiveIcon,
  CalendarIcon,
  ClipboardListIcon
} from "@/components/shared/icons";

function Reporting() {
  const { t } = useTranslation();

  const reportCards = [
    {
      title: "Weekly view for one user",
      icon: <UserIcon className="h-6 w-6 text-pink-500" />,
      href: "/reporting/weekly-user"
    },

    {
      title: "Weekly view for all users",
      icon: <UsersIcon className="h-6 w-6 text-pink-500" />,
      href: "/reporting/weekly-all"
    },
    {
      title: "Project overview",
      icon: <FolderIcon className="h-6 w-6 text-green-500" />,
      href: "/reporting/project-overview"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("page.reporting.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card, index) => (
          <Link
            href={card.href}
            key={index}
          >
            <Card className="p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-3">
              <div className="bg-white p-2 rounded-md">{card.icon}</div>
              <span className="font-medium">{card.title}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AuthenticatedRoute(Reporting, []);
