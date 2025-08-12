// Color palette for dynamic backgrounds
const colorPalette = [
  '#EF4444', // red-500
  '#F97316', // orange-500
  '#EAB308', // yellow-500
  '#22C55E', // green-500
  '#0EA5E9', // sky-500
  '#6366F1', // indigo-500
  '#EC4899', // pink-500
  '#10B981', // emerald-500
  '#6B7280', // gray-500
  '#F43F5E', // rose-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#F59E0B', // amber-500
  '#A855F7', // purple-500
  '#EF4444', // red-500
  '#F97316', // orange-500
  '#EAB308', // yellow-500
  '#22C55E', // green-500
  '#0EA5E9', // sky-500
  '#6366F1', // indigo-500
  '#EC4899', // pink-500
];

// Helper to get initials from a name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Helper to get a dynamic color based on name
export const getColorFromName = (name) => {
  if (!name) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colorPalette.length);
  return colorPalette[index];
};
