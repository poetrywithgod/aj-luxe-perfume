import { MarketingHeader } from "@/components/MarketingHeader";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MarketingHeader />
      {children}
    </>
  );
}
