
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Shield, Edit, Save, X, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  patientData: {
    patientName: string;
    patientId: string;
    email: string;
    healthCardId: string;
  };
}

const ProfileSettings = ({ patientData }: ProfileSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: patientData.patientName,
    email: patientData.email,
    phone: "+91 9876543210",
    address: "123 Main Street, City, State - 400001",
    preferredHospital: "City General Hospital",
    emergencyContact: "+91 9876543211",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      fullName: patientData.patientName,
      email: patientData.email,
      phone: "+91 9876543210",
      address: "123 Main Street, City, State - 400001",
      preferredHospital: "City General Hospital",
      emergencyContact: "+91 9876543211",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
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
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{patientData.patientName}</h3>
                <p className="text-sm text-muted-foreground">Patient ID: {patientData.patientId}</p>
                <p className="text-sm text-muted-foreground">Health Card: {patientData.healthCardId}</p>
                <div className="mt-2">
                  <Button size="sm" variant="outline">Change Photo</Button>
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
                        className={`w-full p-2 border rounded-md ${isEditing ? '' : 'bg-gray-50'}`}
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
                        className={`w-full p-2 border rounded-md ${isEditing ? '' : 'bg-gray-50'}`}
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
                        className={`w-full p-2 border rounded-md ${isEditing ? '' : 'bg-gray-50'}`}
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
                        className={`w-full p-2 border rounded-md ${isEditing ? '' : 'bg-gray-50'}`}
                        value={formData.address}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="preferredHospital" className="text-sm font-medium">
                      Preferred Hospital
                    </label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <input
                        id="preferredHospital"
                        name="preferredHospital"
                        className={`w-full p-2 border rounded-md ${isEditing ? '' : 'bg-gray-50'}`}
                        value={formData.preferredHospital}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="emergencyContact" className="text-sm font-medium">
                      Emergency Contact
                    </label>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <input
                        id="emergencyContact"
                        name="emergencyContact"
                        className={`w-full p-2 border rounded-md ${isEditing ? '' : 'bg-gray-50'}`}
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
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
              <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
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
                <label htmlFor="emiReminders" className="text-sm">Enable</label>
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
                <label htmlFor="appointmentReminders" className="text-sm">Enable</label>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <h3 className="text-sm font-medium">Health Card Balance Alerts</h3>
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
                <label htmlFor="balanceAlerts" className="text-sm">Enable</label>
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
                <label htmlFor="promotionalOffers" className="text-sm">Enable</label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSettings;
