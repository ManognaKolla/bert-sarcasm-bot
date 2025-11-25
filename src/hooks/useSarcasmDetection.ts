import { useState, useCallback, useRef } from 'react';
import { pipeline } from '@huggingface/transformers';

export interface SarcasmResult {
  label: string;
  score: number;
  isSarcastic: boolean;
}

export const useSarcasmDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [result, setResult] = useState<SarcasmResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pipelineRef = useRef<any>(null);

  const initializePipeline = useCallback(async () => {
    if (pipelineRef.current) return;
    
    try {
      setIsModelLoading(true);
      pipelineRef.current = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'webgpu' }
      );
      setIsModelLoading(false);
    } catch (err) {
      console.error('Failed to initialize model:', err);
      setError('Failed to load AI model. Please refresh the page.');
      setIsModelLoading(false);
    }
  }, []);

  const detectSarcasm = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!pipelineRef.current) {
        await initializePipeline();
      }

      const output = await pipelineRef.current(text);
      const topResult = output[0];
      
      // Interpret results: NEGATIVE sentiment with high confidence may indicate sarcasm
      const isSarcastic = topResult.label === 'NEGATIVE' && topResult.score > 0.65;
      
      setResult({
        label: isSarcastic ? 'Sarcastic' : 'Not Sarcastic',
        score: isSarcastic ? topResult.score : 1 - topResult.score,
        isSarcastic
      });
    } catch (err) {
      console.error('Detection error:', err);
      setError('Failed to analyze text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [initializePipeline]);

  return {
    detectSarcasm,
    isLoading,
    isModelLoading,
    result,
    error,
    initializePipeline
  };
};
