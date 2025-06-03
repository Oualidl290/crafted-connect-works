
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

export const useTrustScore = (workerId: string) => {
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrustScore = async () => {
    if (!workerId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('trust_scores')
        .select('*')
        .eq('worker_id', workerId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      setTrustScore(data || {
        overall_score: 0,
        identity_score: 0,
        skill_score: 0,
        reputation_score: 0,
        reliability_score: 0,
        total_jobs: 0,
        completed_jobs: 0,
        average_rating: 0,
        last_calculated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching trust score:', err);
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
    if (!workerId) return;

    try {
      const { data, error } = await supabase.rpc('calculate_trust_score', {
        worker_uuid: workerId
      });

      if (error) throw error;

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
