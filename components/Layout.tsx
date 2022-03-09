import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout = ({ title = "Instagram", children }: LayoutProps) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>{children}</div>
    </div>
  );
};

export default Layout;
