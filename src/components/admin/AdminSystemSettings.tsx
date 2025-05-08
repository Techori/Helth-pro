
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw, Shield, Database, MailOpen, Bell, Upload, AlertTriangle } from "lucide-react";

const AdminSystemSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Mock data for settings
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "RI Medicare Admin Portal",
    supportEmail: "support@rimedicare.com",
    contactPhone: "+91 1234567890",
    maintenanceMode: false,
    debugMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: 90,
    loginAttempts: 5,
    sessionTimeout: 30,
    twoFactorAuth: true,
    ipRestriction: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    adminNotifications: true,
    userNotifications: true,
    systemAlerts: true
  });

  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Settings Saved",
      description: "Notification settings have been updated successfully.",
    });
  };

  const handleBackupSystem = () => {
    toast({
      title: "Backup Started",
      description: "System backup process has been initiated. This may take a few minutes.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic system settings and configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">System Name</Label>
                    <Input 
                      id="systemName" 
                      value={generalSettings.systemName}
                      onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input 
                      id="supportEmail" 
                      type="email" 
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input 
                      id="contactPhone" 
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">System Mode</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Put the system in maintenance mode (only admins can access)
                      </p>
                    </div>
                    <Switch 
                      id="maintenanceMode" 
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debugMode">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable debug mode for detailed error logs
                      </p>
                    </div>
                    <Switch 
                      id="debugMode" 
                      checked={generalSettings.debugMode}
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, debugMode: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input 
                      id="passwordExpiry" 
                      type="number" 
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                    <Input 
                      id="loginAttempts" 
                      type="number" 
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number" 
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Authentication Options</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for admin users
                      </p>
                    </div>
                    <Switch 
                      id="twoFactorAuth" 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ipRestriction">IP Restriction</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict admin access to specific IP addresses
                      </p>
                    </div>
                    <Switch 
                      id="ipRestriction" 
                      checked={securitySettings.ipRestriction}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipRestriction: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity}>
                <Shield className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system and user notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Notification Channels</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailAlerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="emailAlerts" 
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailAlerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsAlerts">SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via SMS
                      </p>
                    </div>
                    <Switch 
                      id="smsAlerts" 
                      checked={notificationSettings.smsAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsAlerts: checked})}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Notification Types</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="adminNotifications">Admin Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for system administrators
                      </p>
                    </div>
                    <Switch 
                      id="adminNotifications" 
                      checked={notificationSettings.adminNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, adminNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="userNotifications">User Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for end users (patients and hospitals)
                      </p>
                    </div>
                    <Switch 
                      id="userNotifications" 
                      checked={notificationSettings.userNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, userNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemAlerts">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Critical system alerts and notifications
                      </p>
                    </div>
                    <Switch 
                      id="systemAlerts" 
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Maintenance</CardTitle>
              <CardDescription>System backup and maintenance operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="border rounded-md p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Database Backup
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Create a complete backup of the system database
                      </p>
                    </div>
                    <Button onClick={handleBackupSystem}>
                      Start Backup
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center">
                        <MailOpen className="mr-2 h-4 w-4" />
                        Test Email Configuration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Send a test email to verify email configuration
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter email address" 
                        className="w-full md:w-auto" 
                      />
                      <Button variant="outline">
                        Send Test
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        System Updates
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Check for system updates and install them
                      </p>
                    </div>
                    <Button variant="outline">
                      Check for Updates
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-red-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center text-red-700">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Reset System
                      </h3>
                      <p className="text-sm text-red-600">
                        Reset the system to factory defaults. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive">
                      Reset System
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Last system backup: April 5, 2025 at 02:30 AM
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemSettings;
