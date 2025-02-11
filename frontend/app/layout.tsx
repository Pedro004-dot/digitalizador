'use client';
import { Provider } from 'react-redux';
import './globals.css';
import store from './store/store';
import Sidebar from './components/sidebar';
import { usePathname } from 'next/navigation';
import HeaderHome from './components/headerHome';
// export const metadata = {
//   title: 'Next.js',
//   description: 'Generated by Next.js',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';
  return (
    <html lang="pt">
      <body className="bg-white" >
        <Provider store={store}>
          {isLoginPage ? (
              // Apenas renderiza o conteúdo sem a sidebar
              <div className="h-screen">{children}</div>
            ) : (
              // Layout com a sidebar
              <div className="flex h-screen">
                <Sidebar />
                <HeaderHome/>
                <main className="lg:ml-[262px] ml-0 flex-1 overflow-y-auto">
  <div id="content" className="ml-0 flex-1 overflow-y-auto p-0 bg-gray-100 h-full w-full">
    {children}
  </div>
</main>

              </div>
            )}
        </Provider>
        </body>
    </html>
  )
}
