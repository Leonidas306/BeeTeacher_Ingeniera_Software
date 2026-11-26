import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import NavBar from "@/components/common/NavBar";
import ScheduleModal from "@/components/common/ScheduleModal";
import TopBanner from "@/components/common/TopBanner";
import { HeadquartersProvider } from "@/context/Headquarters/HeadquartersProvider";
import { RoomsProvider } from "@/context/Rooms/RoomsProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

const interSans = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

export const metadata: Metadata = {
  title: "BeeTeacher · Colmena de Tutores y Salones UG",
  description:
    "Conecta con tutores por etiquetas de materia (#Cálculo, #Probabilidad), identifica asesores #TutorPar o #Externo, revisa salones vacíos y agenda por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${interSans.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <ThemeProvider>
          <HeadquartersProvider>
            <RoomsProvider>
              <div className="min-h-screen flex flex-col">
                <TopBanner />
                <Header />
                <main className="max-w-6xl w-full mx-auto px-6 flex-1">
                  {children}
                </main>
                <Footer />
                <NavBar />
                <ScheduleModal />
              </div>
            </RoomsProvider>
          </HeadquartersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
