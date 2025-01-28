'use client';
import './globals.css';
import { Provider } from 'react-redux';
import store from './store/store';
import Sidebar from './components/sidebar';

export default function Home() {
  return (
    <div lang="en">
    <div className="h-screen bg-gray-100">
      <Provider store={store}>
        <div className="flex h-full">
          <Sidebar />
          <div>
            <h1 className="text-3xl font-bold">Welcome to the dashboard</h1>
          </div>
        </div>
      </Provider>
    </div>
  </div>
  );
}