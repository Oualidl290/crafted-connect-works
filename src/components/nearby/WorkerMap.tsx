
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star, X } from "lucide-react";
import { Link } from 'react-router-dom';

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
  latitude: number;
  longitude: number;
  distance_km: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface WorkerMapProps {
  workers: Worker[];
  userLocation: UserLocation;
}

export const WorkerMap: React.FC<WorkerMapProps> = ({ workers, userLocation }) => {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Calculate map bounds to fit all workers and user location
  const allLocations = [
    userLocation,
    ...workers.map(w => ({ latitude: w.latitude, longitude: w.longitude }))
  ];
  
  const minLat = Math.min(...allLocations.map(l => l.latitude));
  const maxLat = Math.max(...allLocations.map(l => l.latitude));
  const minLng = Math.min(...allLocations.map(l => l.longitude));
  const maxLng = Math.max(...allLocations.map(l => l.longitude));
  
  const center = {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container - This is a placeholder for now */}
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">خريطة العمال</h3>
          <p className="text-gray-500 mb-4">
            سيتم عرض الخريطة التفاعلية هنا
          </p>
          <div className="text-sm text-gray-600">
            <p>موقعك: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</p>
            <p>عدد العمال: {workers.length}</p>
          </div>
        </div>

        {/* Worker Markers Simulation */}
        <div className="absolute inset-0 pointer-events-none">
          {workers.slice(0, 5).map((worker, index) => (
            <div
              key={worker.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
              }}
              onClick={() => setSelectedWorker(worker)}
            >
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors">
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* User Location Marker */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Worker Info Panel */}
      {selectedWorker && (
        <div className="absolute top-4 right-4 w-80 z-10">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">معلومات العامل</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorker(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedWorker.profile_image_url} />
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    {selectedWorker.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 mb-1">
                    {selectedWorker.full_name}
                  </h4>
                  <p className="text-orange-600 text-sm mb-2">{selectedWorker.trade}</p>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{selectedWorker.rating_avg.toFixed(1)}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {selectedWorker.distance_km} كم
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {selectedWorker.bio}
                  </p>
                  
                  <Link to={`/worker-profile/${selectedWorker.id}`}>
                    <Button size="sm" className="w-full">
                      عرض الملف الشخصي
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-full w-4 h-4"></div>
            <span>موقعك</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-orange-600 rounded-full w-4 h-4"></div>
            <span>العمال</span>
          </div>
        </div>
      </div>
    </div>
  );
};
