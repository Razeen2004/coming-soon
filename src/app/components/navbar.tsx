// navbar.tsx
import { FaBars } from "react-icons/fa";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <div className="w-full bg-[#131315] p-4 flex items-center justify-between border-b border-[#262628] navbar">
      <button
        className="text-white md:hidden" // only show on mobile
        onClick={onToggleSidebar}
      >
        <FaBars size={20} />
      </button>
      <div className="text-white text-lg font-semibold">My Chat App</div>
    </div>
  );
}
