
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Phone, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toggle2FA } from '@/services/twilioService';

const TwoFactorSettings = () => {
  const { authState, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(authState.user?.twoFAEnabled || false);

  const handleToggle2FA = async (enabled: boolean) => {
    setIsLoading(true);
    
    try {
      const result = await toggle2FA(enabled);
      
      if (result.success) {
        setTwoFAEnabled(enabled);
        
        // Update user profile in auth context
        await updateProfile({
          ...authState.user!,
          twoFAEnabled: enabled
        });
        
        toast({
          title: enabled ? "2FA Enabled" : "2FA Disabled",
          description: enabled 
            ? "Two-factor authentication has been enabled for your account"
            : "Two-factor authentication has been disabled for your account",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update 2FA settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update 2FA settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="2fa-toggle" className="text-sm font-medium">
              Enable 2FA via SMS
            </Label>
            <p className="text-sm text-gray-600">
              Receive verification codes on your phone
            </p>
          </div>
          <Switch
            id="2fa-toggle"
            checked={twoFAEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isLoading}
          />
        </div>
        
        {authState.user?.phone && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {authState.user.phone}
            </span>
            {twoFAEnabled && (
              <Check className="h-4 w-4 text-green-500 ml-auto" />
            )}
          </div>
        )}
        
        <Alert>
          <AlertDescription>
            {twoFAEnabled ? (
              <>
                <Check className="h-4 w-4 text-green-500 inline mr-2" />
                Two-factor authentication is enabled. You'll receive a verification code 
                via SMS when logging in.
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-500 inline mr-2" />
                Two-factor authentication is disabled. Enable it to secure your account.
              </>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">How 2FA works:</p>
          <ul className="space-y-1 ml-4">
            <li>• Enter your email and password as usual</li>
            <li>• Receive a 6-digit code via SMS</li>
            <li>• Enter the code to complete login</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorSettings;
