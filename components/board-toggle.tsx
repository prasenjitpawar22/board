"use client";

import Link from "next/link";
import { Label } from "./ui/label";
import { usePathname } from "next/navigation";

export default function BoardToggle() {
  const path = usePathname();

  return (
    <div className="bg-background border flex shadow rounded-lg">
      <Link
        href={"/"}
        className={`p-2 ${
          path === "/" ? "bg-muted" : ""
        } cursor-pointer hover:bg-muted w-14 transition-all duration-200`}
      >
        <Label className="cursor-pointer">Board</Label>
      </Link>
      <Link
        href={"/list"}
        className={`p-2 ${
          path === "/list" ? "bg-muted" : ""
        } cursor-pointer hover:bg-muted w-14 transition-all duration-200`}
      >
        <Label className="cursor-pointer">List</Label>
      </Link>
    </div>
  );
}
