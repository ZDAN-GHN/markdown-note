import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ContextMenu({ x, y, visible, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-32 bg-geek-bg border border-geek-border shadow-lg"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
