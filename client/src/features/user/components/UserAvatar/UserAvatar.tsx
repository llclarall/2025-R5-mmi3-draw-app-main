type UserAvatarProps = {
  username: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function UserAvatar({ username, size = 'md' }: UserAvatarProps) {
  // on extrait l'initiale du username 
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const getBackgroundColor = (name: string): string => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#98D8C8',
      '#BB8FCE',
      '#85C1E2',
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };


  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-md`}
      style={{ backgroundColor: getBackgroundColor(username) }}
      title={username}
    >
      {getInitial(username)}
    </div>
  );
}