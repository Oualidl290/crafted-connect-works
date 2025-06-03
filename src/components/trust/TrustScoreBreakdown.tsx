
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Award, Star, Clock, User } from "lucide-react";

interface TrustScoreData {
  overall_score: number;
  identity_score: number;
  skill_score: number;
  reputation_score: number;
  reliability_score: number;
  total_jobs: number;
  completed_jobs: number;
  average_rating: number;
}

interface TrustScoreBreakdownProps {
  trustData: TrustScoreData;
}

export const TrustScoreBreakdown = ({ trustData }: TrustScoreBreakdownProps) => {
  const scoreComponents = [
    {
      label: 'Identity Verification',
      score: trustData.identity_score,
      maxScore: 25,
      icon: User,
      description: 'Document verification and identity confirmation'
    },
    {
      label: 'Skills Assessment',
      score: trustData.skill_score,
      maxScore: 25,
      icon: Award,
      description: 'Professional skills and certification verification'
    },
    {
      label: 'Reputation',
      score: trustData.reputation_score,
      maxScore: 30,
      icon: Star,
      description: 'Client reviews and ratings'
    },
    {
      label: 'Reliability',
      score: trustData.reliability_score,
      maxScore: 20,
      icon: Clock,
      description: 'Job completion rate and consistency'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>Trust Score Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{trustData.overall_score}%</div>
          <div className="text-gray-600">Overall Trust Score</div>
        </div>
        
        <div className="space-y-4">
          {scoreComponents.map((component, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <component.icon className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{component.label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {component.score}/{component.maxScore}
                </span>
              </div>
              <Progress 
                value={(component.score / component.maxScore) * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">{component.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{trustData.completed_jobs}</div>
            <div className="text-sm text-gray-600">Jobs Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{trustData.average_rating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
