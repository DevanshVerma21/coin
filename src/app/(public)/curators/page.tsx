import { redirect } from "next/navigation";

// Curators page removed — redirect to homepage inquiry section
export default function CuratorsPage() {
  redirect("/#inquiry");
}
