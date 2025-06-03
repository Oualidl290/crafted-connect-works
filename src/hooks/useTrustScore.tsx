
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrustScoreData {
  overall_score: number;
  identity_score: number;
  skill_score: number;
  reputation_score: number;
  reliability_score: number;
  total_jobs: number;
  completed_jobs: number;
  average_rating: number;
  last_calculated: string;
}

export const useTrustScore = (workerId: string | null) => {
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrustScore = async () => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching trust score for worker:', workerId);

      const { data, error: fetchError } = await supabase
        .from('trust_scores')
        .select('*')
        .eq('worker_id', workerId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching trust score:', fetchError);
        throw fetchError;
      }

      console.log('Trust score data:', data);

      if (!data) {
        // Create initial trust score record if none exists
        const initialData = {
          worker_id: workerId,
          overall_score: 0,
          identity_score: 0,
          skill_score: 0,
          reputation_score: 0,
          reliability_score: 0,
          total_jobs: 0,
          completed_jobs: 0,
          average_rating: 0,
          last_calculated: new Date().toISOString()
        };

        const { data: newData, error: insertError } = await supabase
          .from('trust_scores')
          .insert(initialData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating initial trust score:', insertError);
          throw insertError;
        }

        setTrustScore(newData);
      } else {
        setTrustScore(data);
      }
    } catch (err) {
      console.error('Error in fetchTrustScore:', err);
      setError('Failed to load trust score');
      toast({
        title: "Error",
        description: "Failed to load trust score data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const recalculateTrustScore = async () => {
    if (!workerId) {
      toast({
        title: "Error",
        description: "No worker ID provided",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Recalculating trust score for worker:', workerId);

      const { data, error } = await supabase.rpc('calculate_trust_score', {
        worker_uuid: workerId
      });

      if (error) {
        console.error('Error recalculating trust score:', error);
        throw error;
      }

      console.log('Recalculated trust score:', data);

      toast({
        title: "Trust score updated",
        description: `Your trust score has been recalculated: ${data}%`,
      });

      // Refresh the trust score data
      await fetchTrustScore();
      
      return data;
    } catch (err) {
      console.error('Error recalculating trust score:', err);
      toast({
        title: "Error",
        description: "Failed to recalculate trust score.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTrustScore();
  }, [workerId]);

  return {
    trustScore,
    loading,
    error,
    refetch: fetchTrustScore,
    recalculate: recalculateTrustScore
  };
};
