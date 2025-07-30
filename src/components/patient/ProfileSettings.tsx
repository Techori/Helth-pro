import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Save,
  X,
  Bell,
  Fingerprint,
  Lock,
  Camera,
  Eye,
  Smartphone,
  Settings,
  QrCode,
  Copy,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FaceAuthComponent from "./FaceAuthComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/services/authService";
import { Switch } from "@/components/ui/switch";
import { apiRequest} from "@/services/api";
import { logoutUser } from "@/services/authService";
import TwoFactorSettings from "./TwoFactorSettings";

const ProfileSettings = () => {
  const { authState, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [faceAuthRegistered, setFaceAuthRegistered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    preferredHospital: "",
    emergencyContact: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFASetupData, setTwoFASetupData] = useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [activeSessions, setActiveSessions] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emiReminders: true,
    appointmentReminders: true,
    balanceAlerts: true,
    promotionalOffers: false,
  });


  // Update form data when user data changes
  useEffect(() => {
    if (authState.user) {
      setFormData({
        fullName: `${authState.user.firstName} ${authState.user.lastName}`,
        email: authState.user.email || "",
        phone: authState.user.phone || "",
        address: authState.user.kycData?.address || "",
        preferredHospital: authState.user.preferredHospital || "",
        emergencyContact: authState.user.emergencyContact || "",
      });
      setTwoFAEnabled(!!authState.user.twoFAEnabled);
      setNotificationPreferences({
        emiReminders: authState.user.notificationPreferences?.emiReminders ?? true,
        appointmentReminders: authState.user.notificationPreferences?.appointmentReminders ?? true,
        balanceAlerts: authState.user.notificationPreferences?.balanceAlerts ?? true,
        promotionalOffers: authState.user.notificationPreferences?.promotionalOffers ?? false,
      });
      fetchFaceAuthStatus();
    }
  }, [authState.user]);

  const fetchFaceAuthStatus = async () => {
    try {
      const response = await apiRequest('/users/face-auth/status');
      setFaceAuthRegistered(response.registered);
    } catch (error) {
      console.error('Error fetching face auth status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch face authentication status",
        variant: "destructive",
      });
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const avatarData = event.target?.result as string;
        
        try {
          const response = await apiRequest('/users/upload-avatar', {
            method: 'POST',
            body: JSON.stringify({ avatarData })
          });

          // Update user profile with new avatar
          await updateProfile({
            ...authState.user,
            avatar: response.imageUrl,
          });

          toast({
            title: "Profile Photo Updated",
            description: "Your profile photo has been updated successfully.",
          });
        } catch (error) {
          if(error.status === 400) {
            toast({
              title: "Upload Failed",
              description:"This photo is already uploaded. Please try different image.",
              variant: "destructive",
            });
          }else{
          toast({
            title: "Upload Failed",
            description: "Failed to upload profile photo. Please try again.",
            variant: "destructive",
          });}
        } finally {
          setUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      await updateProfile({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        kycData: {
          address: formData.address
        },
        preferredHospital: formData.preferredHospital,
        emergencyContact: formData.emergencyContact,
      });

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (authState.user) {
      setFormData({
        fullName: `${authState.user.firstName} ${authState.user.lastName}`,
        email: authState.user.email || "",
        phone: authState.user.phone || "",
        address: authState.user.kycData?.address || "",
        preferredHospital: authState.user.preferredHospital || "",
        emergencyContact: authState.user.emergencyContact || "",
      });
    }
    setIsEditing(false);
  };

  const handleFaceRegistered = (success: boolean) => {
    setFaceAuthRegistered(success);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Invalid Password",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setIsPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    }
  };

  const handleSetup2FA = async () => {
    try {
      const response = await apiRequest('/users/2fa/setup', {
        method: 'POST',
      });
      
      setTwoFASetupData({
        secret: response.secret,
        qrCode: response.qrCode,
        backupCodes: response.backupCodes
      });
    } catch (error) {
      toast({
        title: "2FA Setup Failed",
        description: "Failed to set up two-factor authentication.",
        variant: "destructive",
      });
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('/users/2fa/enable', {
        method: 'POST',
        body: JSON.stringify({ token: verificationToken })
      });
      
      setTwoFAEnabled(true);
      setIs2FADialogOpen(false);
      setTwoFASetupData(null);
      setVerificationToken("");
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
      });
    } catch (error) {
      toast({
        title: "2FA Enable Failed",
        description: "Failed to enable two-factor authentication. Please check your code.",
        variant: "destructive",
      });
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt("Enter your password to disable 2FA:");
    if (!password) return;

    try {
      await apiRequest('/users/2fa/disable', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      
      setTwoFAEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    } catch (error) {
      toast({
        title: "2FA Disable Failed",
        description: "Failed to disable 2FA. Please check your password.",
        variant: "destructive",
      });
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const sessions = await apiRequest('/users/sessions');
      console.log('Active Sessions:', sessions.sessions);
      setActiveSessions(sessions.sessions);
      setIsSessionsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Failed to Load Sessions",
        description: "Could not retrieve active sessions.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      console.log('Session revoked:', sessionId);

      await apiRequest(`/users/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      //change sessionId to ObjectId
      setActiveSessions((prev) => prev.filter((s) => s._id !== sessionId));
      if (checkTokenSessionCurrent({sessionId })) {
        // If the current session is revoked, log out the user
        logoutUser();
        toast({
          title: "Session Revoked",
          description: "Your current session has been revoked. You have been logged out.",
        });
      }
      else {
        toast({
          title: "Session Revoked",
          description: "The session has been revoked successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Revoke Failed",
        description: "Failed to revoke session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const checkTokenSessionCurrent = (session: any) => {
    const currentToken = localStorage.getItem('token');
    console.log('Is Current Session:', session.token === currentToken);
    return session.token === currentToken;
  }

  const handleSaveNotificationPreferences = async () => {
    try {
      await apiRequest('/users/notification-preferences', {
        method: 'PUT',
        body: JSON.stringify(notificationPreferences),
      });

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save notification preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
    });
  };

  if (!authState.user) {
    return null;
  }

  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Personal Info
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={authState.user.avatar }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {formData.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Patient ID: {authState.user.uhid}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    KYC Status: {authState.user.kycStatus}
                  </p>
                  <div className="mt-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handlePhotoUpload}
                      disabled={uploading}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </label>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                          id="fullName"
                          name="fullName"
                          className={`w-full p-2 border rounded-md ${
                            isEditing ? "" : "bg-gray-50"
                          }`}
                          value={formData.fullName}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className={`w-full p-2 border rounded-md ${
                            isEditing ? "" : "bg-gray-50"
                          }`}
                          value={formData.email}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                          id="phone"
                          name="phone"
                          className={`w-full p-2 border rounded-md ${
                            isEditing ? "" : "bg-gray-50"
                          }`}
                          value={formData.phone}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="address" className="text-sm font-medium">
                        Address
                      </label>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                          id="address"
                          name="address"
                          className={`w-full p-2 border rounded-md ${
                            isEditing ? "" : "bg-gray-50"
                          }`}
                          value={formData.address}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="preferredHospital"
                        className="text-sm font-medium"
                      >
                        Preferred Hospital
                      </label>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                          id="preferredHospital"
                          name="preferredHospital"
                          className={`w-full p-2 border rounded-md ${
                            isEditing ? "" : "bg-gray-50"
                          }`}
                          value={formData.preferredHospital}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="emergencyContact"
                        className="text-sm font-medium"
                      >
                        Emergency Contact
                      </label>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <input
                          id="emergencyContact"
                          name="emergencyContact"
                          className={`w-full p-2 border rounded-md ${
                            isEditing ? "" : "bg-gray-50"
                          }`}
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="ml-auto">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences
                </CardDescription>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Password</h3>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and your new password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentPassword" className="text-right">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          className="col-span-3"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newPassword" className="text-right">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className="col-span-3"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirmPassword" className="text-right">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className="col-span-3"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleChangePassword}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                    {twoFAEnabled && (
                      <p className="text-sm text-green-600 mt-1">✓ Enabled</p>
                    )}
                  </div>
                  <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={twoFAEnabled ? handleDisable2FA : handleSetup2FA}>
                        <Smartphone className="mr-2 h-4 w-4" />
                        {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                          {twoFASetupData ? 'Complete 2FA Setup' : 'Enable 2FA to secure your account'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        {twoFASetupData ? (
                          <>
                            <div className="text-center">
                              <p className="text-sm mb-4">Scan this QR code with your authenticator app:</p>
                              <div className="flex justify-center mb-4">
                                <img src={twoFASetupData.qrCode} alt="2FA QR Code" className="w-48 h-48 border" />
                              </div>
                              <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-2">Or enter this secret manually:</p>
                                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded text-sm">
                                  <span className="font-mono">{twoFASetupData.secret}</span>
                                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(twoFASetupData.secret)}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mb-4">
                                <Label htmlFor="verificationToken">Enter 6-digit code from your app:</Label>
                                <Input
                                  id="verificationToken"
                                  value={verificationToken}
                                  onChange={(e) => setVerificationToken(e.target.value)}
                                  placeholder="000000"
                                  maxLength={6}
                                  className="text-center text-lg tracking-wider"
                                />
                              </div>
                              {twoFASetupData.backupCodes && (
                                <div className="mb-4 text-left">
                                  <p className="text-xs text-muted-foreground mb-2">Save these backup codes:</p>
                                  <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                                    {twoFASetupData.backupCodes.map((code, index) => (
                                      <div key={index}>{code}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="text-sm mb-4">
                              Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
                            </p>
                            <div className="flex items-center space-x-2">
                              <QrCode className="h-4 w-4" />
                              <span className="text-sm">Download an authenticator app like Google Authenticator or Authy</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setIs2FADialogOpen(false);
                          setTwoFASetupData(null);
                          setVerificationToken("");
                        }}>
                          Cancel
                        </Button>
                        {twoFASetupData ? (
                          <Button onClick={handleEnable2FA}>
                            Enable 2FA
                          </Button>
                        ) : (
                          <Button onClick={handleSetup2FA}>
                            Setup 2FA
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div> */}
              <TwoFactorSettings/>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Login Devices</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      View and manage devices that have accessed your account
                    </p>
                  </div>
                  <Dialog open={isSessionsDialogOpen} onOpenChange={setIsSessionsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={fetchActiveSessions}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Active Sessions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Active Sessions</DialogTitle>
                        <DialogDescription>
                          These are the devices and locations where your account is currently logged in.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 max-h-96 overflow-y-auto">
                        {activeSessions.length > 0 ? (
                          <div className="space-y-3">
                            {activeSessions.map((session: any, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center space-x-3">
                                  <Smartphone className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">{session.deviceName || 'Unknown Device'}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {session.location.city},{session.location.region},{session.location.country} • {session.lastAccessed || 'Active now'}
                                    </p>
                                    {/* {session.isActive && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                                    )} */}  
                                    {checkTokenSessionCurrent(session) && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Current</span>
                                    )}


                                  </div>
                                </div>
                                {!checkTokenSessionCurrent(session) && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRevokeSession(session._id)}
                                  >
                                    Sign Out
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No active sessions found</p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSessionsDialogOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium">Face Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up face authentication for payments
                    </p>
                  </div>
                  {faceAuthRegistered && (
                    <div className="flex items-center text-green-600">
                      <Fingerprint className="h-4 w-4 mr-1" />
                      <span className="text-sm">Registered</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <FaceAuthComponent
          emailId={authState.user.email || ""}
          onFaceRegistered={handleFaceRegistered}
        />
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium">EMI Payment Reminders</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive reminders about upcoming EMI payments
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.emiReminders}
                  onCheckedChange={(checked) => handleNotificationChange('emiReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="text-sm font-medium">Appointment Reminders</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive reminders about upcoming hospital appointments
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.appointmentReminders}
                  onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="text-sm font-medium">
                    Health Card Balance Alerts
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts when your health card balance is low
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.balanceAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('balanceAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="text-sm font-medium">Promotional Offers</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive information about new features and promotional offers
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.promotionalOffers}
                  onCheckedChange={(checked) => handleNotificationChange('promotionalOffers', checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" onClick={handleSaveNotificationPreferences}>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileSettings;
