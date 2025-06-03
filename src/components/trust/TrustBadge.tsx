
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, Star, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const TrustBadge = ({ score, size = 'md', showLabel = true, className }: TrustBadgeProps) => {
  const getTrustLevel = (score: number) => {
    if (score >= 85) return { level: 'Elite', color: 'bg-green-500', icon: Award };
    if (score >= 70) return { level: 'Verified Pro', color: 'bg-blue-500', icon: CheckCircle };
    if (score >= 50) return { level: 'Trusted', color: 'bg-orange-500', icon: Star };
    return { level: 'Basic', color: 'bg-gray-500', icon: Shield };
  };

  const { level, color, icon: Icon } = getTrustLevel(score);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={cn(
        color, 
        'text-white border-0',
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(iconSizes[size], 'mr-1')} />
      {showLabel && level} {score}%
    </Badge>
  );
};
