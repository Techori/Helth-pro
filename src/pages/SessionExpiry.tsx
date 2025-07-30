import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Clock, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { checkAuthToken } from '@/services/authService';

const SessionExpiry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {authState} = useAuth();

useEffect(()=>{
    if(authState.user){
        console.log("user found")
        navigate('/');
        return
    }
    else if(localStorage.getItem('token')){
        console.log("token")
        navigate('/')
    }
},[]);

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <Clock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Session Expired</CardTitle>
          <CardDescription className="text-gray-600">
            Your session has expired due to an invalid or missing authentication token.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Please log in again to continue using the application.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleReturnToLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <LogIn className="inline h-4 w-4 mr-2" />
            Back to Login
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Return to the login page to authenticate and resume your session.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionExpiry;