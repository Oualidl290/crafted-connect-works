
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, Award, Camera, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SkillProofUploadProps {
  workerId: string;
  onComplete: () => void;
}

type ProofType = 'certificate' | 'license' | 'work_photo' | 'work_pdf' | 'testimonial';

interface ProofTypeConfig {
  type: ProofType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const proofTypes: ProofTypeConfig[] = [
  {
    type: 'certificate',
    label: 'Certificates',
    icon: <Award className="w-5 h-5" />,
    description: 'Professional certifications and training certificates',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    type: 'license',
    label: 'Licenses',
    icon: <FileText className="w-5 h-5" />,
    description: 'Professional licenses and permits',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    type: 'work_photo',
    label: 'Work Photos',
    icon: <Camera className="w-5 h-5" />,
    description: 'Photos of your completed work and projects',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    type: 'work_pdf',
    label: 'Work Documents',
    icon: <FileText className="w-5 h-5" />,
    description: 'Project documentation, invoices, or contracts',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    type: 'testimonial',
    label: 'Testimonials',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Client testimonials and references',
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  }
];

export const SkillProofUpload: React.FC<SkillProofUploadProps> = ({ workerId, onComplete }) => {
  const [selectedType, setSelectedType] = useState<ProofType | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedProofs, setUploadedProofs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!selectedType) {
      setError('Please select a proof type first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // In a real app, you'd upload to Supabase Storage or another service
      // For demo, we'll simulate an upload with a placeholder URL
      const mockUrl = `https://example.com/uploads/${Date.now()}_${file.name}`;

      const { data, error: insertError } = await supabase
        .from('skill_proofs')
        .insert({
          worker_id: workerId,
          proof_type: selectedType,
          document_url: mockUrl,
          description: description || null
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploadedProofs(prev => [...prev, data]);
      setDescription('');
      setSelectedType(null);

      toast({
        title: "Proof Uploaded",
        description: "Your skill proof has been uploaded successfully!",
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload proof');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <Upload className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Upload Skill Proofs</CardTitle>
        <p className="text-gray-600">
          Show your expertise with certificates, photos of your work, and testimonials
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proofTypes.map((proof) => (
            <Card
              key={proof.type}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedType === proof.type ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedType(proof.type)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${proof.color}`}>
                    {proof.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{proof.label}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{proof.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedType && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Selected:</span>
              <Badge className={proofTypes.find(p => p.type === selectedType)?.color}>
                {proofTypes.find(p => p.type === selectedType)?.label}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={2}
                placeholder="Add a description for this proof..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-gray-500 mb-4">
                Support for images, PDFs, and documents up to 10MB
              </p>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <Button asChild disabled={isLoading}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Choose File'
                  )}
                </label>
              </Button>
            </div>
          </div>
        )}

        {uploadedProofs.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Uploaded Proofs ({uploadedProofs.length})
            </h3>
            <div className="space-y-2">
              {uploadedProofs.map((proof, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={proofTypes.find(p => p.type === proof.proof_type)?.color}>
                      {proofTypes.find(p => p.type === proof.proof_type)?.label}
                    </Badge>
                    {proof.description && (
                      <span className="text-sm text-gray-600">{proof.description}</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Pending Review
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onComplete}>
            Skip for Now
          </Button>
          <Button 
            onClick={onComplete}
            disabled={uploadedProofs.length === 0}
          >
            Continue to Platform
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
