import { Fugaz_One,Open_Sans} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Head from "./head";
import Logout from "@/components/Logout";

const opensans= Open_Sans({
  subsets:["latin"]
})

const fugaz= Fugaz_One({
  subsets: ["latin"],
  weight:['400']
})

export const metadata = {
  title: "Moodly",
  description: "Track your daily mood every day of the year!",
};

export default function RootLayout({ children }) {

  const header=(
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href={'/'}>
      <h1 className={' text-base sm:text-lg textGradient ' + fugaz.className}>Moodly</h1>
      </Link>
      <div className="flex justify-between items-center">
        <Logout />
      </div>
    </header>
  )

  const footer=(
    <footer className="p-4 sm:p-8 grid place-items-center">
        <p className={'text-indigo-500 ' + fugaz.className}>Created with 💗 by MK</p>
    </footer>
  )

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
      <body
        className={'w-full max-w-[1000px] text-slate-700 mx-auto text-sm sm:text-base min-h-screen flex flex-col ' + opensans.className}
      >
        {header}
        {children}
        {footer}
      </body>
      </AuthProvider>

    </html>
  );
}
