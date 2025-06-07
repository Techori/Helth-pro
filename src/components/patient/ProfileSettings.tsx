import { useState, useEffect } from "react";
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
  Settings,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FaceAuthComponent from "./FaceAuthComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateUserProfile } from "@/services/api";

const ProfileSettings = () => {
  const { authState, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [faceAuthRegistered, setFaceAuthRegistered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    preferredHospital: "",
    emergencyContact: "",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (authState.user) {
      setFormData({
        fullName: `${authState.user.firstName} ${authState.user.lastName}`,
        email: authState.user.email,
        phone: authState.user.phone || "",
        address: authState.user.kycData?.address || "",
        preferredHospital: authState.user.kycData?.preferredHospital || "",
        emergencyContact: authState.user.kycData?.emergencyContact || "",
      });
    }
  }, [authState.user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Split full name into first and last name
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      await updateProfile({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        kycData: {
          address: formData.address,
          preferredHospital: formData.preferredHospital,
          emergencyContact: formData.emergencyContact,
        },
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
        email: authState.user.email,
        phone: authState.user.phone || "",
        address: authState.user.kycData?.address || "",
        preferredHospital: authState.user.kycData?.preferredHospital || "",
        emergencyContact: authState.user.kycData?.emergencyContact || "",
      });
    }
    setIsEditing(false);
  };

  const handleFaceRegistered = (success: boolean) => {
    setFaceAuthRegistered(success);
  };

  if (!authState.user) {
    return null; // Or a loading state
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
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={authState.user.avatar || "https://github.com/shadcn.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
                    <Button size="sm" variant="outline">
                      Change Photo
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
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Login Devices</h3>
                <Button variant="outline">View Active Sessions</Button>
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
        {/* Face Authentication Component */}
        <FaceAuthComponent
          emailId={authState.user.email}
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emiReminders"
                    className="mr-2 h-4 w-4"
                    defaultChecked
                  />
                  <label htmlFor="emiReminders" className="text-sm">
                    Enable
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="text-sm font-medium">Appointment Reminders</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive reminders about upcoming hospital appointments
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="appointmentReminders"
                    className="mr-2 h-4 w-4"
                    defaultChecked
                  />
                  <label htmlFor="appointmentReminders" className="text-sm">
                    Enable
                  </label>
                </div>
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="balanceAlerts"
                    className="mr-2 h-4 w-4"
                    defaultChecked
                  />
                  <label htmlFor="balanceAlerts" className="text-sm">
                    Enable
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="text-sm font-medium">Promotional Offers</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive information about new features and promotional offers
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="promotionalOffers"
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="promotionalOffers" className="text-sm">
                    Enable
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileSettings;
