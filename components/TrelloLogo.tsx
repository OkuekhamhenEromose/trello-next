interface TrelloLogoProps {
  showAtlassian?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrelloLogo({ showAtlassian = false, className = '', size = 'md' }: TrelloLogoProps) {
  const sizes = {
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-lg',
      atlassian: 'text-[10px]',
    },
    md: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-xl',
      atlassian: 'text-xs',
    },
    lg: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-2xl',
      atlassian: 'text-sm',
    },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size].container} bg-gradient-to-br from-[hsl(210,100%,60%)] to-[hsl(210,100%,45%)] rounded flex items-center justify-center`}>
        <svg width={sizes[size].icon} height={sizes[size].icon} viewBox="0 0 24 24" fill="white">
          <rect x="3" y="3" width="8" height="18" rx="1.5" />
          <rect x="13" y="3" width="8" height="11" rx="1.5" />
        </svg>
      </div>
      <div>
        {showAtlassian && (
          <p className={`${sizes[size].atlassian} text-white/60 uppercase tracking-wider`}>Atlassian</p>
        )}
        <span className={`${sizes[size].text} font-bold text-white`}>Trello</span>
      </div>
    </div>
  );
}