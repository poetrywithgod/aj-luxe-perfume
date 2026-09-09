import { Header } from "@/components/Header";
import { getCurrentIdentity } from "@/lib/auth";

export default async function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const identity = await getCurrentIdentity();

  return (
    <>
      <Header identity={identity} />
      {children}
    </>
  );
}
