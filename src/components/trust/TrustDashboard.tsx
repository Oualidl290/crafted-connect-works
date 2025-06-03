
import React, { useState, useEffect } from 'react';
import { TrustBadge } from './TrustBadge';
import { TrustScoreBreakdown } from './TrustScoreBreakdown';
import { IdentityVerification } from './IdentityVerification';
import { CertificationManager } from './CertificationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Star, FileCheck, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrustDashboardProps {
  workerId: string;
}

export const TrustDashboard = ({ workerId }: TrustDashboardProps) => {
  const [trustData, setTrustData] = useState<any>(null);
  const [identityDocs, setIdentityDocs] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrustData = async () => {
    try {
      setLoading(true);
      
      // Fetch trust score
      const { data: trustScore } = await supabase
        .from('trust_scores')
        .select('*')
        .eq('worker_id', workerId)
        .single();

      // Fetch identity documents
      const { data: docs } = await supabase
        .from('identity_documents')
        .select('*')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });

      // Fetch certifications
      const { data: certs } = await supabase
        .from('certifications')
        .select('*')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });

      setTrustData(trustScore || {
        overall_score: 0,
        identity_score: 0,
        skill_score: 0,
        reputation_score: 0,
        reliability_score: 0,
        total_jobs: 0,
        completed_jobs: 0,
        average_rating: 0
      });
      setIdentityDocs(docs || []);
      setCertifications(certs || []);
    } catch (error) {
      console.error('Error fetching trust data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load trust and verification data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerId) {
      fetchTrustData();
    }
  }, [workerId]);

  const refreshData = () => {
    fetchTrustData();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading trust data...</div>;
  }

  const verificationSteps = [
    {
      title: 'Identity Verification',
      description: 'Upload government ID and selfie',
      completed: identityDocs.some(doc => doc.verification_status === 'verified'),
      count: identityDocs.filter(doc => doc.verification_status === 'verified').length,
      icon: FileCheck
    },
    {
      title: 'Professional Certifications',
      description: 'Add relevant certifications and licenses',
      completed: certifications.some(cert => cert.verification_status === 'verified'),
      count: certifications.filter(cert => cert.verification_status === 'verified').length,
      icon: Award
    },
    {
      title: 'Skill Assessment',
      description: 'Complete skill verification tests',
      completed: false, // Will implement later
      count: 0,
      icon: Star
    }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Trust Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <TrustBadge score={trustData.overall_score} size="lg" />
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Building Trust Score</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Complete verification steps to increase your score and attract more clients
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <TrustScoreBreakdown trustData={trustData} />
        </div>
      </div>

      {/* Verification Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {verificationSteps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <step.icon className={`h-5 w-5 ${step.completed ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{step.title}</span>
                  {step.completed && (
                    <Badge className="bg-green-500 text-white">{step.count} verified</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
                <div className={`w-full h-2 rounded-full ${step.completed ? 'bg-green-200' : 'bg-gray-200'}`}>
                  <div className={`h-full rounded-full ${step.completed ? 'bg-green-600 w-full' : 'bg-gray-300 w-1/3'}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Tabs */}
      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="identity">Identity Verification</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <IdentityVerification
            workerId={workerId}
            documents={identityDocs}
            onDocumentUploaded={refreshData}
          />
        </TabsContent>

        <TabsContent value="certifications">
          <CertificationManager
            workerId={workerId}
            certifications={certifications}
            onCertificationAdded={refreshData}
          />
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-600" />
                <span>Skills Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Skills assessment coming soon</p>
              <p className="text-sm text-gray-500">
                Complete skill-based tests to demonstrate your expertise
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
