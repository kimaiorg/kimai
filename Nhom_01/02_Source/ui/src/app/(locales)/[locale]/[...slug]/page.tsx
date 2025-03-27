import React from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

interface PageProps {
  params: {
    locale: string;
    slug: string[];
  };
}

export default function CatchAllPage({ params }: PageProps) {
  const slug = params.slug.join("/");

  // Create a dynamic import for the requested page
  // This will load the page component from the (pages) directory
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
          return () => notFound();
        }),
      {
        loading: () => <Loading />,
        ssr: true
      }
    );

    // Render the page component
    return <PageComponent />;
  } catch (error) {
    console.error(`Failed to load page for slug: ${slug}`, error);
    return notFound();
  }
}
