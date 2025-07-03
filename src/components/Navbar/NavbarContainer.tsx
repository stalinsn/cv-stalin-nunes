import React from "react";

interface NavbarContainerProps {
  children: React.ReactNode;
}

export default function NavbarContainer({ children }: NavbarContainerProps) {
  return (
    <header className="topbar">
      <div className="toolbar navbar-container">{children}</div>
    </header>
  );
}
