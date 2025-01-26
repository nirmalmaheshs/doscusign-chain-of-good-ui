import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Heart, ArrowRight, DollarSign, Bell } from "lucide-react";
import logo from "@/assets/ds-logo-on-white.png";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  requestAuthCode,
} from "../lib/auth";

const LandingPage = () => {
  const handleDocuSignLogin = async () => {
    try {
      const verifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(verifier);
      localStorage.setItem("code_verifier", verifier);
      localStorage.setItem("code_challenge", codeChallenge);
      await requestAuthCode(codeChallenge);
    } catch (error) {
      console.error("Error initiating OAuth flow:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/"; // Navigate to landing page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white transform rotate-45" />
            </div>
            <span className="text-xl font-bold text-blue-600">
              Chain of Good
            </span>
          </div>
          <Button
            variant="outline"
            className="flex items-center cursor-pointer hover:bg-transparent"
            onClick={() => handleDocuSignLogin()}
          >
            Sign in with
            <img src={logo} alt="DocuSign" className="h-8 rounded" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Support Relief Funds with Ease
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Make a difference through secure monthly donations to relief funds.
          Simple setup, automated payments, and transparent tracking.
        </p>
      </section>

      {/* Process Flow */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Cause</h3>
              <p className="text-gray-600">
                Browse and select from available relief funds that align with
                your giving goals
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Make a Payment</h3>
              <p className="text-gray-600">
                Complete the secure DocuSign form and make a one-time payment
                through Stripe
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-600">
                Receive monthly invoices and notifications about your impact
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 text-white rounded-2xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Sign in with DocuSign to start your giving journey today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => handleDocuSignLogin()}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center border-t pt-8">
          <span className="text-sm text-gray-600">
            © 2025 Chain of Good. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
