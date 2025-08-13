import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Loader, FileText, Copy, Share2, Shield, Search, Eye } from 'lucide-react';

const FakeNewsChecker = () => {
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const mockAnalysis = {
    isFake: false,
    confidence: 87,
    reasons: [
      "Information matches official government sources",
      "Claims are realistic and verifiable",
      "No sensational language detected",
      "Source appears credible"
    ],
    recommendations: [
      "This appears to be authentic information",
      "You can proceed with confidence",
      "Always verify through official channels"
    ],
    officialSources: [
      "Official government website",
      "Ministry of Finance",
      "PMO India"
    ]
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !url.trim()) {
      alert('Please enter some text or URL to analyze');
      return;
    }

    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResult(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setInputText('');
    setUrl('');
    setResult(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Fake News Check Result',
        text: `Analysis result: ${result.isFake ? 'FAKE' : 'AUTHENTIC'} news with ${result.confidence}% confidence`,
        url: window.location.href
      });
    } else {
      copyToClipboard(`Analysis result: ${result.isFake ? 'FAKE' : 'AUTHENTIC'} news with ${result.confidence}% confidence`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fake News Checker</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Detect misleading or fake information about government schemes and scholarships using AI-powered analysis
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button 
              className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'text' 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('text')}
            >
              <FileText className="h-5 w-5 mr-2" />
              Text Analysis
            </button>
            <button 
              className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'url' 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('url')}
            >
              <Share2 className="h-5 w-5 mr-2" />
              URL Analysis
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {activeTab === 'text' ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Enter the news text or claim to analyze:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the news text, social media post, or claim here..."
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-gray-900 placeholder-gray-500"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Enter the URL to analyze:
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              className={`flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading || (!inputText.trim() && !url.trim())
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
              onClick={handleAnalyze}
              disabled={loading || (!inputText.trim() && !url.trim())}
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze for Fake News
                </>
              )}
            </button>
            <button 
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className={`p-6 ${result.isFake ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${result.isFake ? 'bg-red-100' : 'bg-green-100'}`}>
                    {result.isFake ? 
                      <XCircle className="h-8 w-8 text-red-600" /> : 
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    }
                  </div>
                  <div className="ml-4">
                    <h2 className={`text-2xl font-bold ${result.isFake ? 'text-red-900' : 'text-green-900'}`}>
                      {result.isFake ? 'FAKE NEWS DETECTED' : 'AUTHENTIC INFORMATION'}
                    </h2>
                    <p className="text-gray-600 text-lg">Confidence: {result.confidence}%</p>
                  </div>
                </div>
                <button 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={shareResult}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-blue-600" />
                    Analysis Reasons
                  </h3>
                  <ul className="space-y-2">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-2 w-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Sources to Verify</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.officialSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <span className="text-gray-700 font-medium">{source}</span>
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
                        onClick={() => copyToClipboard(source)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How it Works Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How it works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h4>
              <p className="text-gray-600 leading-relaxed">
                Our specialized AI analyzes text patterns, sources, and claims against verified government data.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Source Verification</h4>
              <p className="text-gray-600 leading-relaxed">
                Cross-references information with official government websites and databases.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Pattern Recognition</h4>
              <p className="text-gray-600 leading-relaxed">
                Identifies common fake news patterns and sensational language.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeNewsChecker; 