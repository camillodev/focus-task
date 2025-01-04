import Link from 'next/link'
import { Home, Calendar, Inbox, CheckSquare, FolderOpen } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-8">Todoist Clone</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/today" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <Calendar size={20} />
              <span>Today</span>
            </Link>
          </li>
          <li>
            <Link href="/upcoming" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <Inbox size={20} />
              <span>Upcoming</span>
            </Link>
          </li>
          <li>
            <Link href="/projects" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
              <FolderOpen size={20} />
              <span>Projects</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

