import React from 'react';

type SidebarNavItem = {
  title: string;
  url: string;
  section: string;
};

const SidebarNav: React.FC<{ items: SidebarNavItem[] }> = ({ items }) => {
  // const sections = items.reduce((rv, x) => {
  //   (rv[x['section']] = rv[x['section']] || []).push(x);
  //   return rv;
  // }, {});
  return <nav>
    <header>
      <span className="logo">Snaplearn</span>
    </header>
    {items.map(item => (
      <a key={item.title} href={item.url}>{item.title}</a>
    ))}
  </nav>;
};

export default SidebarNav;