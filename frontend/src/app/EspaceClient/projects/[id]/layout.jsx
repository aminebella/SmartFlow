"use client";

import React from "react";
import { useParams } from "next/navigation";

import TopNavbar from "@/components/client/layoutClient/TopNavbar";

export default function ProjectLayout({ children }) {
  const { id } = useParams();

  return (
    <div style={{ backgroundColor: "#EEF0F3" }}>
      <TopNavbar />
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
}