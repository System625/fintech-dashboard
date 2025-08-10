import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TestResult {
  success: boolean;
  endpoint: string;
  data: any;
  error?: string;
}

export default function MswTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Test various API endpoints
  const runTests = async () => {
    setLoading(true);
    setResults([]);
    
    const endpoints = [
      '/api/user/profile',
      '/api/savings',
      '/api/investments',
      '/api/transactions',
      '/api/investments/asset-allocation',
      '/api/transactions/categories'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        setResults(prev => [...prev, {
          success: response.ok,
          endpoint,
          data
        }]);
      } catch (error) {
        setResults(prev => [...prev, {
          success: false,
          endpoint,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">MSW Test Component</h1>
        <Button 
          onClick={runTests}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Run API Tests'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <Card key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="text-md flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {result.endpoint}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.success ? (
                  <pre className="text-xs bg-slate-100 p-2 rounded max-h-[250px] overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                ) : (
                  <div className="text-red-500">{result.error}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 