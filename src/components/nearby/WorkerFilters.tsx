
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface WorkerFiltersProps {
  radiusKm: number;
  professionFilter: string;
  sortBy: 'distance' | 'rating';
  onFiltersChange: (radius: number, profession: string, sortBy: 'distance' | 'rating') => void;
}

export const WorkerFilters: React.FC<WorkerFiltersProps> = ({
  radiusKm,
  professionFilter,
  sortBy,
  onFiltersChange
}) => {
  const professions = [
    'كهربائي',
    'سباك',
    'نجار',
    'دهان',
    'ميكانيكي',
    'مقاول',
    'بناء',
    'تكييف',
    'تنظيف',
    'حدائق'
  ];

  const radiusOptions = [
    { value: 5, label: '5 كم' },
    { value: 10, label: '10 كم' },
    { value: 15, label: '15 كم' },
    { value: 25, label: '25 كم' },
    { value: 50, label: '50 كم' }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">تصفية النتائج</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Radius Filter */}
          <div>
            <Label htmlFor="radius" className="text-sm font-medium mb-2 block">
              نطاق البحث
            </Label>
            <Select
              value={radiusKm.toString()}
              onValueChange={(value) => onFiltersChange(parseInt(value), professionFilter, sortBy)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {radiusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profession Filter */}
          <div>
            <Label htmlFor="profession" className="text-sm font-medium mb-2 block">
              المهنة
            </Label>
            <Select
              value={professionFilter}
              onValueChange={(value) => onFiltersChange(radiusKm, value, sortBy)}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع المهن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المهن</SelectItem>
                {professions.map((profession) => (
                  <SelectItem key={profession} value={profession}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div>
            <Label htmlFor="sort" className="text-sm font-medium mb-2 block">
              ترتيب حسب
            </Label>
            <Select
              value={sortBy}
              onValueChange={(value: 'distance' | 'rating') => onFiltersChange(radiusKm, professionFilter, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">الأقرب أولاً</SelectItem>
                <SelectItem value="rating">الأعلى تقييماً</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              onClick={() => onFiltersChange(radiusKm, professionFilter, sortBy)}
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              بحث
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
