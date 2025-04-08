"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LocalizedInvoicePreviewRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Extract the invoice ID from params
    const slug = params?.slug;
    let invoiceId = "";

    if (Array.isArray(slug) && slug.length > 0) {
      invoiceId = slug.join("/");
    } else if (typeof slug === "string") {
      invoiceId = slug;
    }

    if (invoiceId) {
      // Redirect to the non-localized invoice preview page
      router.replace(`/invoice-preview/${invoiceId}`);
    } else {
      // If no ID is found, redirect to invoice history
      router.replace("/invoice-history");
    }
  }, [params, router]);

  // Show loading spinner while redirecting
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
