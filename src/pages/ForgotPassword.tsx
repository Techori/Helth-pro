import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { forgotPassword } from "@/services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      toast({
        title: "Sending reset link",
        description: "Please wait while we process your request...",
      });

      const { data, error: apiError } = await forgotPassword(email);

      if (apiError) {
        setError(apiError.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: apiError.message,
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Reset link sent",
          description: "Please check your email for the password reset link.",
        });
        setEmail("");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto">
              <Card
                className={`border-gray-100 transition-all duration-500 ${
                  loaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold font-display text-gray-900">
                    Forgot Password
                  </CardTitle>
                  <CardDescription>
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <div className="text-center text-sm">
                      <Link
                        to="/login"
                        className="text-brand-600 hover:underline"
                      >
                        Back to Login
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
