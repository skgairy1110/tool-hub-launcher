import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, RotateCcw, Sparkles, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const AiHumanizer = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sampleTexts = [
    "Artificial intelligence has revolutionized numerous industries by automating complex tasks and improving efficiency. Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions with remarkable accuracy.",
    "The implementation of sustainable practices in modern businesses requires strategic planning and careful consideration of environmental impact. Companies must balance profitability with ecological responsibility to ensure long-term success.",
    "Digital transformation has become essential for organizations seeking to remain competitive in today's rapidly evolving marketplace. Cloud computing, data analytics, and automation technologies enable businesses to optimize operations and enhance customer experiences."
  ];

  const humanizationTechniques = [
    "Replace formal language with conversational tone",
    "Add natural transitions and connecting phrases",
    "Vary sentence structure and length",
    "Include personal pronouns and active voice",
    "Use contractions and colloquial expressions",
    "Add emotional context and human perspective"
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const loadSample = () => {
    const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setInputText(randomSample);
    setOutputText("");
  };

  const humanizeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to humanize",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple humanization simulation (in a real app, this would call an AI service)
    const humanized = humanizeTextSimulation(inputText);
    setOutputText(humanized);
    setIsLoading(false);
    
    toast({
      title: "Text humanized successfully",
      description: "Your AI text has been transformed to sound more human",
    });
  };

  const humanizeTextSimulation = (text: string): string => {
    let result = text;
    
    // Replace formal phrases with casual ones
    const replacements = [
      { from: /Furthermore,/g, to: "Plus," },
      { from: /Additionally,/g, to: "Also," },
      { from: /Therefore,/g, to: "So," },
      { from: /In conclusion,/g, to: "To wrap up," },
      { from: /It is important to note that/g, to: "Worth mentioning that" },
      { from: /Subsequently,/g, to: "Then," },
      { from: /Consequently,/g, to: "As a result," },
      { from: /Nevertheless,/g, to: "Still," },
      { from: /However,/g, to: "But," },
      { from: /Moreover,/g, to: "What's more," },
      { from: /significant/g, to: "big" },
      { from: /utilize/g, to: "use" },
      { from: /demonstrate/g, to: "show" },
      { from: /implement/g, to: "put in place" },
      { from: /facilitate/g, to: "help" },
      { from: /accommodate/g, to: "fit" },
      { from: /numerous/g, to: "many" },
      { from: /substantial/g, to: "major" },
      { from: /comprehensively/g, to: "fully" }
    ];
    
    replacements.forEach(replacement => {
      result = result.replace(replacement.from, replacement.to);
    });
    
    // Add some contractions
    result = result.replace(/cannot/g, "can't");
    result = result.replace(/will not/g, "won't");
    result = result.replace(/do not/g, "don't");
    result = result.replace(/does not/g, "doesn't");
    result = result.replace(/have not/g, "haven't");
    result = result.replace(/has not/g, "hasn't");
    result = result.replace(/are not/g, "aren't");
    result = result.replace(/is not/g, "isn't");
    result = result.replace(/was not/g, "wasn't");
    result = result.replace(/were not/g, "weren't");
    
    return result;
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <Badge variant="secondary" className="bg-pink-100 text-pink-700">
            AI Text Humanizer
          </Badge>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            AI Text Humanizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Transform AI-generated content into natural, human-like writing that bypasses AI detection tools
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Bypasses AI detectors</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Maintains meaning</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant results</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-pink-600" />
                  AI Text Input
                </CardTitle>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Paste your AI-generated text below</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Words: {wordCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSample}
                      className="text-pink-600 border-pink-200 hover:bg-pink-50"
                    >
                      Try Sample
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your AI-generated text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] resize-none text-base leading-relaxed"
                />
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  
                  <Button
                    onClick={humanizeText}
                    disabled={!inputText.trim() || isLoading}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Humanizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Humanize Text
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            {outputText && (
              <Card className="mt-6 shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                    Humanized Text
                  </CardTitle>
                  <p className="text-gray-600">Your text has been transformed to sound more human</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                    <p className="text-base leading-relaxed text-gray-900 whitespace-pre-wrap">
                      {outputText}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>Text has been humanized successfully</span>
                    </div>
                    
                    <Button
                      onClick={() => copyToClipboard(outputText)}
                      variant="outline"
                      className="text-pink-600 border-pink-200 hover:bg-pink-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* How it Works */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm text-gray-600">Paste your AI-generated text</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm text-gray-600">Click "Humanize Text" to transform</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm text-gray-600">Copy your human-like text</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Humanization Techniques */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Humanization Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {humanizationTechniques.map((technique, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{technique}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Works best with paragraphs of 50+ words</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Compatible with text from ChatGPT, Claude, Gemini</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Review output for context accuracy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiHumanizer;