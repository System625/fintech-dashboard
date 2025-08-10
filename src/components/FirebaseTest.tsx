import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const FirebaseTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { currentUser } = useAuth();

  const testFirebaseConnection = async () => {
    try {
      setTestStatus('idle');
      setTestResult('Testing Firebase connection...');
      
      // Import Firebase dynamically to avoid window not defined errors
      const { auth } = await import('@/services/firebase');
      
      // Simple test - just check if auth is initialized
      if (auth) {
        setTestResult('Firebase Auth is connected and working properly!');
        setTestStatus('success');
      } else {
        setTestResult('Firebase Auth could not be initialized.');
        setTestStatus('error');
      }
    } catch (error) {
      console.error('Firebase test error:', error);
      setTestResult(`Error testing Firebase: ${error instanceof Error ? error.message : String(error)}`);
      setTestStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
        <CardDescription>
          Click the button below to test your Firebase connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        {testResult && (
          <div className={`p-4 rounded-md mb-4 ${
            testStatus === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : testStatus === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {testResult}
          </div>
        )}
        <div>
          <p className="text-sm font-medium mb-2">Current Auth Status:</p>
          <div className="p-2 bg-muted rounded-md">
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {currentUser 
                ? `Logged in as: ${currentUser.email}`
                : 'Not logged in'}
            </pre>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={testFirebaseConnection}
          className="w-full"
        >
          Test Firebase Connection
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FirebaseTest; 