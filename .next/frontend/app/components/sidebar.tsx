'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Link from 'next/link';
import LogoutButton from './logout';

const Sidebar = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-full">
      <nav className="flex flex-col p-4">
        <Link href="/">Dashboard</Link>
        <Link href="/pastas">Pastas</Link>
        <Link href="/digitalizar">Digitalizar</Link>
        <Link href="/logout">Sair</Link>
        <LogoutButton/>
      </nav>
    </aside>
  );
};

export default Sidebar;