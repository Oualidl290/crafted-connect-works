import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, MapPin, Calendar, DollarSign, Filter, Briefcase } from "lucide-react";
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  location_city: string;
  status: string;
  created_at: string;
  client_id: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showPostDialog, setShowPostDialog] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    category: '',
    budget_min: '',
    budget_max: '',
    location_city: '',
    location_address: ''
  });

  const categories = [
    'كهرباء', 'سباكة', 'نجارة', 'دهان', 'تنظيف', 'صيانة', 'بناء', 'تكييف', 'أخرى'
  ];

  const cities = [
    'الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'أكادير', 'طنجة', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'posted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({ title: "خطأ", description: "فشل في تحميل الوظائف", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "خطأ", description: "يجب تسجيل الدخول لنشر وظيفة", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .insert([{
          ...newJob,
          budget_min: parseInt(newJob.budget_min),
          budget_max: parseInt(newJob.budget_max),
          client_id: user.id,
          status: 'posted'
        }]);

      if (error) throw error;

      toast({ title: "نجح!", description: "تم نشر الوظيفة بنجاح" });
      setShowPostDialog(false);
      setNewJob({
        title: '',
        description: '',
        category: '',
        budget_min: '',
        budget_max: '',
        location_city: '',
        location_address: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      toast({ title: "خطأ", description: "فشل في نشر الوظيفة", variant: "destructive" });
    }
  };

  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (categoryFilter === '' || job.category === categoryFilter) &&
    (locationFilter === '' || job.location_city === locationFilter);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-stone-600">جاري تحميل الوظائف...</p>
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
              <Briefcase className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-stone-900">كرافتد - الوظائف</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user && userProfile?.type === 'client' && (
                <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-4 w-4 mr-2" />
                      نشر وظيفة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>نشر وظيفة جديدة</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePostJob} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">عنوان الوظيفة</Label>
                          <Input
                            id="title"
                            value={newJob.title}
                            onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                            placeholder="مثال: إصلاح كهرباء في المنزل"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">الفئة</Label>
                          <Select value={newJob.category} onValueChange={(value) => setNewJob({...newJob, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">وصف الوظيفة</Label>
                        <Textarea
                          id="description"
                          value={newJob.description}
                          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                          placeholder="اشرح تفاصيل العمل المطلوب..."
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budget_min">الحد الأدنى للميزانية (درهم)</Label>
                          <Input
                            id="budget_min"
                            type="number"
                            value={newJob.budget_min}
                            onChange={(e) => setNewJob({...newJob, budget_min: e.target.value})}
                            placeholder="500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget_max">الحد الأقصى للميزانية (درهم)</Label>
                          <Input
                            id="budget_max"
                            type="number"
                            value={newJob.budget_max}
                            onChange={(e) => setNewJob({...newJob, budget_max: e.target.value})}
                            placeholder="1000"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location_city">المدينة</Label>
                          <Select value={newJob.location_city} onValueChange={(value) => setNewJob({...newJob, location_city: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location_address">العنوان التفصيلي (اختياري)</Label>
                        <Input
                          id="location_address"
                          value={newJob.location_address}
                          onChange={(e) => setNewJob({...newJob, location_address: e.target.value})}
                          placeholder="الحي، الشارع..."
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowPostDialog(false)}>
                          إلغاء
                        </Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                          نشر الوظيفة
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              
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
                  placeholder="ابحث في الوظائف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الفئات</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
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
                  setCategoryFilter('');
                  setLocationFilter('');
                }}
              >
                مسح الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-700 mb-2">لا توجد وظائف</h3>
              <p className="text-stone-500">لم يتم العثور على وظائف تطابق معايير البحث</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status === 'posted' ? 'متاح' : job.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {job.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-stone-600 line-clamp-3">{job.description}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-stone-500">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.budget_min} - {job.budget_max} درهم</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-stone-500">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location_city}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-stone-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(job.created_at).toLocaleDateString('ar-MA')}</span>
                  </div>
                  
                  {/* Remove the user display for now */}
                  
                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                      تقديم عرض
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      التفاصيل
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

export default Jobs;