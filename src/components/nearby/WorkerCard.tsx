
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star, Phone, MessageCircle } from "lucide-react";

interface Worker {
  id: string;
  full_name: string;
  trade: string;
  city: string;
  bio: string;
  phone: string;
  profile_image_url?: string;
  rating_avg: number;
  rating_count: number;
  distance_km: number;
}

interface WorkerCardProps {
  worker: Worker;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={worker.profile_image_url} />
            <AvatarFallback className="bg-orange-100 text-orange-600 text-lg">
              {worker.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-stone-900 truncate">
                {worker.full_name}
              </h3>
              <Badge variant="secondary" className="ml-2">
                {worker.distance_km} كم
              </Badge>
            </div>
            
            <p className="text-orange-600 font-medium mb-2">{worker.trade}</p>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{worker.city}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{worker.rating_avg.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({worker.rating_count})</span>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {worker.bio}
            </p>
            
            <div className="flex space-x-2">
              <Link to={`/worker-profile/${worker.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  عرض الملف الشخصي
                </Button>
              </Link>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-1" />
                اتصال
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
