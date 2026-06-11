import React from 'react';

const palette = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-fuchsia-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
];

const getInitials = (name = 'Usuário') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

const getPalette = (name = 'Usuário') => {
  const value = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[value % palette.length];
};

const UserAvatar = ({ name = 'Usuário', className = 'h-10 w-10 text-sm' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${getPalette(name)} font-semibold text-white shadow-sm ${className}`}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
