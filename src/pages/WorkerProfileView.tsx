
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, MapPin, Star, Calendar, MessageCircle, Phone, Wrench, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  profile_completion: number;
  is_approved: boolean;
  identity_verification_status: string;
  created_at: string;
}

interface TrustScore {
  overall_score: number;
  identity_score: number;
  skill_score: number;
  reputation_score: number;
  reliability_score: number;
  total_jobs: number;
  completed_jobs: number;
}

const WorkerProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchWorkerProfile();
    }
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching worker profile for ID:', id);

      // Fetch worker data
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (workerError) {
        console.error('Error fetching worker:', workerError);
        throw new Error('فشل في تحميل بيانات العامل');
      }

      if (!workerData) {
        throw new Error('لم يتم العثور على العامل');
      }

      console.log('Worker data loaded:', workerData);
      setWorker(workerData);

      // Fetch trust score
      const { data: trustData, error: trustError } = await supabase
        .from('trust_scores')
        .select('*')
        .eq('worker_id', id)
        .maybeSingle();

      if (trustError) {
        console.warn('Error fetching trust score:', trustError);
      } else if (trustData) {
        console.log('Trust score loaded:', trustData);
        setTrustScore(trustData);
      }

    } catch (err: any) {
      console.error('Error loading worker profile:', err);
      setError(err.message || 'حدث خطأ في تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Alert variant="destructive">
              <AlertDescription>{error || 'لم يتم العثور على الملف الشخصي'}</AlertDescription>
            </Alert>
            <Link to="/" className="mt-4 inline-block">
              <Button variant="outline">العودة للرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />موثق</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />قيد المراجعة</Badge>;
      default:
        return <Badge variant="outline">غير موثق</Badge>;
    }
  };

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
            <Link to="/worker-auth">
              <Button variant="outline">تسجيل عامل جديد</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={worker.profile_image_url} />
                    <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                      {worker.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-stone-900">{worker.full_name}</h1>
                      {getStatusBadge(worker.identity_verification_status)}
                    </div>
                    
                    <p className="text-xl text-orange-600 mb-3">{worker.trade}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{worker.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{worker.rating_avg.toFixed(1)}</span>
                        <span className="text-gray-500">({worker.rating_count} تقييم)</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">مدى اكتمال الملف الشخصي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-orange-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${worker.profile_completion}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{worker.profile_completion}% مكتمل</p>
              </CardContent>
            </Card>

            {/* Trust Score */}
            {trustScore && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">نقاط الثقة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{trustScore.overall_score}</div>
                      <div className="text-sm text-gray-600">النقاط الإجمالية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{trustScore.identity_score}</div>
                      <div className="text-sm text-gray-600">توثيق الهوية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{trustScore.skill_score}</div>
                      <div className="text-sm text-gray-600">المهارات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{trustScore.reputation_score}</div>
                      <div className="text-sm text-gray-600">السمعة</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Registration Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات التسجيل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">
                      {new Date(worker.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">حالة الموافقة:</span>
                    <Badge variant={worker.is_approved ? "default" : "secondary"}>
                      {worker.is_approved ? "معتمد" : "قيد المراجعة"}
                    </Badge>
                  </div>
                  {trustScore && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">إجمالي المهام:</span>
                        <span className="font-medium">{trustScore.total_jobs}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">المهام المكتملة:</span>
                        <span className="font-medium text-green-600">{trustScore.completed_jobs}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">معلومات الاتصال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">{worker.phone}</span>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    احجز الآن
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    إرسال رسالة
                  </Button>
                </div>

                {!worker.is_approved && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      هذا العامل قيد المراجعة. سيتم تفعيل الحجز بعد الموافقة على الملف الشخصي.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileView;
