import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSarcasmDetection } from '@/hooks/useSarcasmDetection';
import { Progress } from '@/components/ui/progress';

const exampleTexts = [
  "Oh great, another meeting. Just what I needed today!",
  "I love waiting in long lines, it's my favorite thing ever.",
  "The weather is beautiful today, perfect for a walk.",
  "Wow, you're a genius! Nobody's ever thought of that before.",
];

export const SarcasmDetector = () => {
  const [text, setText] = useState('');
  const { detectSarcasm, isLoading, isModelLoading, result, error, initializePipeline } = useSarcasmDetection();

  useEffect(() => {
    initializePipeline();
  }, [initializePipeline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await detectSarcasm(text);
  };

  const handleExampleClick = (example: string) => {
    setText(example);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by BERT</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Sarcasm Detection AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Advanced natural language processing to detect sarcasm and irony in English text
          </p>
        </div>

        {/* Model Loading Status */}
        {isModelLoading && (
          <Card className="p-6 mb-8 border-primary/20 bg-card/50 backdrop-blur shadow-card">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Loading AI Model...</p>
                <p className="text-sm text-muted-foreground">This may take a moment on first load</p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Input Card */}
        <Card className="p-8 mb-8 border-border bg-card shadow-card hover:shadow-glow transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-foreground">
                Enter text to analyze
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="min-h-[150px] resize-none bg-background border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground"
                disabled={isLoading || isModelLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || isModelLoading || !text.trim()}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-6 text-lg transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Detect Sarcasm
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Example Texts */}
        <Card className="p-6 mb-8 border-border bg-card/50 backdrop-blur">
          <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wide">
            Try These Examples
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exampleTexts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading || isModelLoading}
                className="text-left p-4 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {example}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-6 mb-8 border-destructive/50 bg-destructive/10 backdrop-blur animate-in fade-in slide-in-from-bottom duration-300">
            <p className="text-destructive font-medium">{error}</p>
          </Card>
        )}

        {/* Results Display */}
        {result && (
          <Card className="p-8 border-border bg-card shadow-card animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-full ${result.isSarcastic ? 'bg-accent/10' : 'bg-primary/10'}`}>
                {result.isSarcastic ? (
                  <ThumbsDown className="w-8 h-8 text-accent" />
                ) : (
                  <ThumbsUp className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {result.label}
                  </h3>
                  <p className="text-muted-foreground">
                    {result.isSarcastic
                      ? 'This text likely contains sarcasm or irony'
                      : 'This text appears to be straightforward'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                    <span className="text-sm font-bold text-foreground">
                      {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={result.score * 100} 
                    className="h-3"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
