import React, { useState } from 'react';

type SidebarNavItem = {
  title: string;
  url: string;
  section: string;
  active: boolean;
  iconClass: string;
};

const SidebarNav: React.FC<{ items: SidebarNavItem[], title: string }> = ({ items, title }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const getSections = (): SidebarNavItem[][] => {
    const itemsBySection: Record<string, SidebarNavItem[]> = {};
    items.forEach(item => {
      if (!itemsBySection[item.section]) {
        itemsBySection[item.section] = [];
      }
      itemsBySection[item.section].push(item);
    });
    return Object.values(itemsBySection);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const sections = getSections();

  // TODO mobile logo
  return <nav className={isNavbarOpen ? 'open' : ''}>
    <div className="navbar">
      <a href="/">
        <span className="logo-g">&nbsp;</span>
      </a>
      <h1>{title}</h1>
      <span className="toggle" role="button" tabIndex={0} onClick={toggleNavbar}></span>
    </div>
    <header>
      <span className="logo">Snaplearn</span>
    </header>
    {sections.map((section, index) => (
      <section key={index}>
        {section.map(item => (
          <a key={item.title} href={item.url} aria-current={item.active ? 'page' : undefined} title={item.title}>
            <span className={'icon ' + item.iconClass}></span>
            {item.title}
          </a>
        ))}
      </section>
    ))}
  </nav>;
};

export default SidebarNav;