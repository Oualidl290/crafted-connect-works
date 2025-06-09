
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Star, Wrench, List, Map, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WorkerCard } from "@/components/nearby/WorkerCard";
import { WorkerMap } from "@/components/nearby/WorkerMap";
import { LocationDetector } from "@/components/nearby/LocationDetector";
import { WorkerFilters } from "@/components/nearby/WorkerFilters";

interface NearbyWorker {
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

const NearbyWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<NearbyWorker[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [radiusKm, setRadiusKm] = useState(10);
  const [professionFilter, setProfessionFilter] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  const handleLocationDetected = (location: UserLocation) => {
    setUserLocation(location);
    fetchNearbyWorkers(location, radiusKm, professionFilter);
  };

  const fetchNearbyWorkers = async (
    location: UserLocation,
    radius: number,
    profession: string
  ) => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching nearby workers:', { location, radius, profession });

      const { data, error: rpcError } = await supabase.rpc('get_nearby_workers', {
        user_lat: location.latitude,
        user_lng: location.longitude,
        radius_km: radius,
        profession_filter: profession || null
      });

      if (rpcError) {
        console.error('Error fetching nearby workers:', rpcError);
        throw new Error('فشل في تحميل العمال القريبين');
      }

      console.log('Nearby workers fetched:', data);
      setWorkers(data || []);
    } catch (err: any) {
      console.error('Error loading nearby workers:', err);
      setError(err.message || 'حدث خطأ في تحميل العمال');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newRadius: number, newProfession: string, newSortBy: 'distance' | 'rating') => {
    setRadiusKm(newRadius);
    setProfessionFilter(newProfession);
    setSortBy(newSortBy);
    
    if (userLocation) {
      fetchNearbyWorkers(userLocation, newRadius, newProfession);
    }
  };

  const sortedWorkers = [...workers].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance_km - b.distance_km;
    } else {
      return b.rating_avg - a.rating_avg;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-stone-900">Crafted</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                <List className="h-4 w-4 mr-2" />
                قائمة
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                size="sm"
              >
                <Map className="h-4 w-4 mr-2" />
                خريطة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">العمال القريبون</h1>
          <p className="text-lg text-gray-600">اعثر على أفضل المهنيين في منطقتك</p>
        </div>

        {/* Location Detection */}
        {!userLocation && (
          <div className="mb-8">
            <LocationDetector onLocationDetected={handleLocationDetected} />
          </div>
        )}

        {/* Filters */}
        {userLocation && (
          <div className="mb-6">
            <WorkerFilters
              radiusKm={radiusKm}
              professionFilter={professionFilter}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
            <p className="text-gray-600">جاري البحث عن العمال القريبين...</p>
          </div>
        )}

        {/* Content */}
        {userLocation && !loading && (
          <>
            {workers.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا توجد عمال في هذه المنطقة
                  </h3>
                  <p className="text-gray-600">
                    جرب توسيع نطاق البحث أو تغيير المهنة المطلوبة
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    تم العثور على {workers.length} عامل في نطاق {radiusKm} كم
                  </p>
                </div>

                {/* View Content */}
                {viewMode === 'list' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedWorkers.map((worker) => (
                      <WorkerCard key={worker.id} worker={worker} />
                    ))}
                  </div>
                ) : (
                  <div className="h-[600px] rounded-lg overflow-hidden">
                    <WorkerMap
                      workers={sortedWorkers}
                      userLocation={userLocation}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NearbyWorkers;
