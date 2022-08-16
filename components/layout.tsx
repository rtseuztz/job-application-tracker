import Navbar from './navbar'
import Footer from './footer'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { JsxElement } from 'typescript'

export type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  console.log(children)
  const [random] = useState(Math.random());
  useEffect(() => {
    console.log("Layout MOUNTED", { random });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    return (
        <div>
          <Navbar />
            {children}
          <Footer />
        </div>
      )
}
export default Layout