import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout = ({ title = "Instagram", children }: LayoutProps) => {
  return (
    <div className="h-full min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto max-w-xl px-4 py-32 md:max-w-3xl lg:max-w-4xl">
        {children}
      </div>
    </div>
  );
};

export default Layout;
