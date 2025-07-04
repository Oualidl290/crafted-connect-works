import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Star, Heart, MessageCircle, Filter, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import { TrustBadge } from "@/components/trust/TrustBadge";

interface Worker {
  user_id: string;
  profession: string;
  bio: string;
  experience_years: number;
  rating: number;
  approved: boolean;
  users?: {
    full_name: string;
    location_city: string;
    avatar_url: string;
  };
}

const WorkerSearch = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const professions = [
    'كهربائي', 'سباك', 'نجار', 'دهان', 'منظف', 'فني صيانة', 'بناء', 'تكييف', 'أخرى'
  ];

  const cities = [
    'الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'أكادير', 'طنجة', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان'
  ];

  useEffect(() => {
    fetchWorkers();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('workers_profile')
        .select('*')
        .eq('approved', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast({ title: "خطأ", description: "فشل في تحميل الحرفيين", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('worker_id')
        .eq('client_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.worker_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (workerId: string) => {
    if (!user) {
      toast({ title: "خطأ", description: "يجب تسجيل الدخول لحفظ المفضلين", variant: "destructive" });
      return;
    }

    try {
      const isFavorite = favorites.includes(workerId);
      
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('client_id', user.id)
          .eq('worker_id', workerId);
        
        if (error) throw error;
        setFavorites(favorites.filter(id => id !== workerId));
        toast({ title: "تم", description: "تم إزالة من المفضلين" });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{
            client_id: user.id,
            worker_id: workerId
          }]);
        
        if (error) throw error;
        setFavorites([...favorites, workerId]);
        toast({ title: "تم", description: "تم الإضافة للمفضلين" });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({ title: "خطأ", description: "فشل في تحديث المفضلين", variant: "destructive" });
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfession = professionFilter === '' || worker.profession === professionFilter;
    // Remove location filter for now since we don't have user data
    
    return matchesSearch && matchesProfession;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-stone-600">جاري تحميل الحرفيين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-stone-900">كرافتد - الحرفيين</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/jobs" className="text-stone-600 hover:text-stone-900">
                الوظائف
              </Link>
              <Link to="/" className="text-stone-600 hover:text-stone-900">
                الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>البحث والتصفية</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="ابحث عن حرفي..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={professionFilter} onValueChange={setProfessionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المهن" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المهن</SelectItem>
                  {professions.map(profession => (
                    <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المدن" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المدن</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setProfessionFilter('');
                  setLocationFilter('');
                }}
              >
                مسح الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-700 mb-2">لا يوجد حرفيين</h3>
              <p className="text-stone-500">لم يتم العثور على حرفيين يطابقون معايير البحث</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <Card key={worker.user_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        ح
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{worker.profession}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(worker.user_id)}
                          className="p-1 h-8 w-8"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favorites.includes(worker.user_id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-stone-400'
                            }`} 
                          />
                        </Button>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {worker.profession}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {worker.bio && (
                    <p className="text-stone-600 text-sm line-clamp-2">{worker.bio}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{worker.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-stone-500">
                    <MapPin className="h-4 w-4" />
                    <span>المغرب</span>
                  </div>
                  
                  {worker.experience_years > 0 && (
                    <div className="text-sm text-stone-500">
                      خبرة {worker.experience_years} سنوات
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-4">
                    <Link to={`/worker-profile/${worker.user_id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                        عرض الملف
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      رسالة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerSearch;