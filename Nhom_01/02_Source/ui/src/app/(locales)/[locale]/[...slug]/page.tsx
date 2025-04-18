"use client";

import ErrorPage from "@/app/error";
import Loading from "@/app/loading";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import React from "react";

export default function CatchAllPage({
  params
}: {
  params: {
    locale: string;
    slug: string[];
  };
}) {
  // const slug = React.use(params)["slug"].join("/");
  const slug = params.slug.join("/");

  try {
    // For security, validate the slug to prevent directory traversal attacks
    if (slug.includes("..") || !slug.match(/^[a-zA-Z0-9-\/]+$/)) {
      return notFound();
    }

    // Use Next.js dynamic import to load the page component
    const PageComponent = dynamic(
      () =>
        import(`@/app/(pages)/${slug}/page`).catch(() => {
          // If the import fails, return a component that renders notFound
          const ErrorComponent = () => notFound();
          ErrorComponent.displayName = "ErrorComponent";
          return ErrorComponent;
        }),
      {
        loading: () => <Loading />,
        ssr: false
      }
    );

    // Render the page component
    return <PageComponent />;
  } catch (error) {
    console.error(`Failed to load page for slug: ${slug}`, error);
    return notFound();
  }
}
