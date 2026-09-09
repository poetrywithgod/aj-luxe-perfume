import { MarketingHeader } from "@/components/MarketingHeader";
import { getCurrentIdentity } from "@/lib/auth";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const identity = await getCurrentIdentity();

  return (
    <>
      <MarketingHeader identity={identity} />
      {children}
    </>
  );
}
