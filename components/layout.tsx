import Navbar from './navbar'
import Footer from './footer'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { JsxElement } from 'typescript'

export type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
          <Navbar />
            {children}
          <Footer />
        </>
      )
}
export default Layout