import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IdentityDocument {
  id: string;
  document_type: string;
  document_number: string;
  verification_status: string;
  created_at: string;
}

interface IdentityVerificationProps {
  workerId: string;
  documents: IdentityDocument[];
  onDocumentUploaded: () => void;
}

export const IdentityVerification = ({ workerId, documents, onDocumentUploaded }: IdentityVerificationProps) => {
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const documentTypes = [
    { value: 'national_id', label: 'National ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'professional_license', label: 'Professional License' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', label: 'Pending Review' },
      verified: { color: 'bg-green-500', label: 'Verified' },
      rejected: { color: 'bg-red-500', label: 'Rejected' },
      expired: { color: 'bg-gray-500', label: 'Expired' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'selfie') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Upload file to Supabase Storage (you'll need to create the bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `${workerId}/${type}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const submitVerification = async () => {
    if (!documentType || !documentNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('identity_documents')
        .insert({
          worker_id: workerId,
          document_type: documentType,
          document_number: documentNumber,
          document_url: 'placeholder', // Will be updated with actual upload
          selfie_url: 'placeholder' // Will be updated with actual upload
        });

      if (error) throw error;

      toast({
        title: "Verification submitted",
        description: "Your identity verification has been submitted for review.",
      });

      onDocumentUploaded();
      setDocumentType('');
      setDocumentNumber('');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileCheck className="h-5 w-5 text-blue-600" />
          <span>Identity Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Documents */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Submitted Documents</h4>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium capitalize">
                    {doc.document_type.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    Document #: {doc.document_number}
                  </div>
                </div>
                {getStatusBadge(doc.verification_status)}
              </div>
            ))}
          </div>
        )}

        {/* New Document Upload */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium">Submit New Document</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-number">Document Number</Label>
              <Input
                id="document-number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Enter document number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Upload document photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'document')}
                  className="hidden"
                  id="document-upload"
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => document.getElementById('document-upload')?.click()}
                  disabled={uploading}
                >
                  Choose File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selfie with Document</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Upload selfie holding document</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'selfie')}
                  className="hidden"
                  id="selfie-upload"
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => document.getElementById('selfie-upload')?.click()}
                  disabled={uploading}
                >
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={submitVerification}
            disabled={uploading || !documentType || !documentNumber}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Submit for Verification'}
          </Button>
        </div>

        <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Verification Process</p>
            <p>Your documents will be reviewed within 24-48 hours. Verified identity increases your trust score and improves job opportunities.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
