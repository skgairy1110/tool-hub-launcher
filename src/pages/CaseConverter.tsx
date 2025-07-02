
import { useState } from "react";
import { Type, Copy, ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const CaseConverter = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const caseTypes = [
    {
      id: 'sentence',
      title: 'Sentence case',
      description: 'First word capitalized',
      example: 'This is sentence case'
    },
    {
      id: 'lower',
      title: 'lower case',
      description: 'All letters lowercase',
      example: 'this is lower case'
    },
    {
      id: 'upper',
      title: 'UPPER CASE',
      description: 'All letters uppercase',
      example: 'THIS IS UPPER CASE'
    },
    {
      id: 'title',
      title: 'Title Case',
      description: 'Each word capitalized',
      example: 'This Is Title Case'
    },
    {
      id: 'camel',
      title: 'camelCase',
      description: 'No spaces, each word capitalized except first',
      example: 'thisIsCamelCase'
    },
    {
      id: 'pascal',
      title: 'PascalCase',
      description: 'No spaces, each word capitalized',
      example: 'ThisIsPascalCase'
    },
    {
      id: 'snake',
      title: 'snake_case',
      description: 'Lowercase with underscores',
      example: 'this_is_snake_case'
    },
    {
      id: 'kebab',
      title: 'kebab-case',
      description: 'Lowercase with hyphens',
      example: 'this-is-kebab-case'
    },
    {
      id: 'constant',
      title: 'CONSTANT_CASE',
      description: 'Uppercase with underscores',
      example: 'THIS_IS_CONSTANT_CASE'
    },
    {
      id: 'alternating',
      title: 'aLtErNaTiNg CaSe',
      description: 'Alternating upper and lower case',
      example: 'tHiS iS aLtErNaTiNg CaSe'
    },
    {
      id: 'inverse',
      title: 'iNVERSE cASE',
      description: 'Opposite of normal capitalization',
      example: 'tHIS iS iNVERSE cASE'
    },
    {
      id: 'capitalized',
      title: 'Capitalized Case',
      description: 'First letter of each word capitalized',
      example: 'This Is Capitalized Case'
    }
  ];

  const convertText = (text: string, type: string): string => {
    if (!text.trim()) return '';

    switch (type) {
      case 'sentence':
        return text.toLowerCase().charAt(0).toUpperCase() + text.toLowerCase().slice(1);
      
      case 'lower':
        return text.toLowerCase();
      
      case 'upper':
        return text.toUpperCase();
      
      case 'title':
        return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      
      case 'camel':
        return text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^./, l => l.toLowerCase());
      
      case 'pascal':
        return text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^./, l => l.toUpperCase());
      
      case 'snake':
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
      
      case 'kebab':
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      case 'constant':
        return text.toUpperCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
      
      case 'alternating':
        return text.split('').map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
      
      case 'inverse':
        return text.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('');
      
      case 'capitalized':
        return text.replace(/\b\w/g, l => l.toUpperCase());
      
      default:
        return text;
    }
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }

    const newResults: Record<string, string> = {};
    caseTypes.forEach(caseType => {
      newResults[caseType.id] = convertText(inputText, caseType.id);
    });
    setResults(newResults);

    toast({
      title: "Success",
      description: "Text converted to all case types!",
    });
  };

  const copyToClipboard = (text: string, caseType: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${caseType} text copied to clipboard!`,
    });
  };

  const clearAll = () => {
    setInputText("");
    setResults({});
  };

  const getCharCount = (text: string) => {
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
      paragraphs: text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
    };
  };

  const stats = getCharCount(inputText);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Type className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Text Case Converter</h1>
            <p className="text-gray-600">Convert text between different cases instantly</p>
          </div>

          {/* Input Section */}
          <Card className="shadow-xl border-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Type className="mr-2 h-5 w-5" />
                  Enter Your Text
                </span>
                <Button onClick={clearAll} variant="outline" size="sm">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="min-h-32 resize-none"
              />
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Characters: {stats.characters}</span>
                <span>Characters (no spaces): {stats.charactersNoSpaces}</span>
                <span>Words: {stats.words}</span>
                <span>Sentences: {stats.sentences}</span>
                <span>Paragraphs: {stats.paragraphs}</span>
              </div>

              <Button 
                onClick={handleConvert} 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={!inputText.trim()}
              >
                <Type className="mr-2 h-4 w-4" />
                Convert Text
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {Object.keys(results).length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseTypes.map((caseType) => (
                <Card key={caseType.id} className="shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{caseType.title}</span>
                      <Button
                        onClick={() => copyToClipboard(results[caseType.id], caseType.title)}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <p className="text-sm text-gray-500">{caseType.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-mono break-words">
                        {results[caseType.id] || caseType.example}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Section */}
          <Card className="shadow-xl border-0 mt-8">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Features:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Convert to 12 different case types</li>
                    <li>• Real-time character and word count</li>
                    <li>• One-click copy to clipboard</li>
                    <li>• Handles special characters and numbers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Use Cases:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Programming variable names</li>
                    <li>• Document formatting</li>
                    <li>• Social media posts</li>
                    <li>• Data processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
