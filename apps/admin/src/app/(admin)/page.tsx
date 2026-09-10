import { redirect } from "next/navigation";

// No dashboard/metrics view exists yet (would need Orders/Products data
// surfaced here too, which isn't part of this round) — Reviews is the
// most useful default landing until one is built.
export default function AdminHomePage() {
  redirect("/reviews");
}
