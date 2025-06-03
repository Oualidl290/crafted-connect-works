import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Calendar, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Certification {
  id: string;
  certification_name: string;
  issuing_authority: string;
  certification_number?: string;
  issue_date?: string;
  expiry_date?: string;
  verification_status: string;
  created_at: string;
}

interface CertificationManagerProps {
  workerId: string;
  certifications: Certification[];
  onCertificationAdded: () => void;
}

export const CertificationManager = ({ workerId, certifications, onCertificationAdded }: CertificationManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    certification_name: '',
    issuing_authority: '',
    certification_number: '',
    issue_date: '',
    expiry_date: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.certification_name || !formData.issuing_authority) {
      toast({
        title: "Missing information",
        description: "Please fill in the certification name and issuing authority.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('certifications')
        .insert({
          worker_id: workerId,
          certification_name: formData.certification_name,
          issuing_authority: formData.issuing_authority,
          certification_number: formData.certification_number || null,
          issue_date: formData.issue_date || null,
          expiry_date: formData.expiry_date || null
        });

      if (error) throw error;

      toast({
        title: "Certification added",
        description: "Your certification has been submitted for verification.",
      });

      setFormData({
        certification_name: '',
        issuing_authority: '',
        certification_number: '',
        issue_date: '',
        expiry_date: ''
      });
      setShowAddForm(false);
      onCertificationAdded();
    } catch (error) {
      console.error('Error adding certification:', error);
      toast({
        title: "Failed to add certification",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', label: 'Pending' },
      verified: { color: 'bg-green-500', label: 'Verified' },
      rejected: { color: 'bg-red-500', label: 'Rejected' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span>Professional Certifications</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Certification
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Certifications */}
        {certifications.length > 0 ? (
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{cert.certification_name}</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Building className="h-3 w-3" />
                      <span>{cert.issuing_authority}</span>
                    </div>
                    {cert.certification_number && (
                      <p className="text-sm text-gray-600">
                        Certificate #: {cert.certification_number}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(cert.verification_status)}
                </div>
                
                {(cert.issue_date || cert.expiry_date) && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {cert.issue_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Issued: {formatDate(cert.issue_date)}</span>
                      </div>
                    )}
                    {cert.expiry_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {formatDate(cert.expiry_date)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>No certifications added yet</p>
            <p className="text-sm">Add your professional certifications to boost your trust score</p>
          </div>
        )}

        {/* Add Certification Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium">Add New Certification</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert-name">Certification Name *</Label>
                <Input
                  id="cert-name"
                  value={formData.certification_name}
                  onChange={(e) => setFormData({...formData, certification_name: e.target.value})}
                  placeholder="e.g., Electrical Safety Certificate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuing-authority">Issuing Authority *</Label>
                <Input
                  id="issuing-authority"
                  value={formData.issuing_authority}
                  onChange={(e) => setFormData({...formData, issuing_authority: e.target.value})}
                  placeholder="e.g., National Electrical Board"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-number">Certificate Number</Label>
                <Input
                  id="cert-number"
                  value={formData.certification_number}
                  onChange={(e) => setFormData({...formData, certification_number: e.target.value})}
                  placeholder="Certificate number (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Certification'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
