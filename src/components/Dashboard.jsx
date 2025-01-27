import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Globe,
  Hospital,
  School,
  AlertCircle,
  ArrowRight,
  Info,
  Link2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const reliefFunds = [
  {
    id: 1,
    title: "Global Natural Disaster Response Fund",
    description:
      "Immediate support for communities affected by natural disasters",
    icon: <AlertCircle className="w-6 h-6" />,
    color: "red",
    goal: 500000,
    activeMonthlyDonors: 1250,
    impact: "Provided emergency supplies to 10,000+ families",
    categories: ["Emergency", "Disaster"],
    recentActivity: "Deployed aid to earthquake-affected regions",
    locations: ["Asia", "Americas", "Africa"],
  },
  {
    id: 2,
    title: "Rural Healthcare Access Initiative",
    description: "Supporting healthcare access in underserved communities",
    icon: <Hospital className="w-6 h-6" />,
    color: "blue",
    goal: 300000,
    activeMonthlyDonors: 890,
    impact: "Funded 50 mobile medical camps",
    categories: ["Healthcare", "Emergency"],
    recentActivity: "Launched new mobile clinic program",
    locations: ["Global", "Rural Areas"],
  },
  {
    id: 3,
    title: "Children's Education Empowerment Fund",
    description: "Empowering through education in developing regions",
    icon: <School className="w-6 h-6" />,
    color: "green",
    goal: 250000,
    activeMonthlyDonors: 670,
    impact: "Supported education for 5,000 children",
    categories: ["Education", "Development"],
    recentActivity: "Opened 3 new schools",
    locations: ["Africa", "Asia"],
  },
];

const FundCard = ({ fund }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const colorVariants = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
  };
  const navigate = useNavigate();

  const handleDonate = async () => {
    setIsLoading(true);
    console.log("Starting donation flow for fund:", fund.id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/workflows`,
        {
          method: "POST",
          body: {
            email: localStorage.getItem("email"),
            full_name: localStorage.getItem("full_name"),
            relief_program: fund.title,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      window.location.href = data.instance_url;
    } catch (error) {
      console.error("Error donating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden flex flex-col h-full">
      <CardContent className="pt-6 flex flex-col flex-1 justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-lg ${colorVariants[fund.color]}`}>
            {fund.icon}
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <h4 className="font-semibold">Fund Details</h4>
                <p className="text-sm text-gray-600">{fund.description}</p>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Recent Activity:</p>
                  <p className="text-sm">{fund.recentActivity}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <h3 className="text-xl font-semibold mb-2">{fund.title}</h3>
        <p className="text-gray-600 mb-4">{fund.description}</p>

        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            {fund.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {fund.activeMonthlyDonors.toLocaleString()} donors
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            {fund.locations.join(", ")}
          </div>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          className="mt-auto"
        >
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              Donate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{fund.title}</h4>
                <p className="text-sm text-gray-600">{fund.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Next Steps:</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Complete the donation agreement form</li>
                  <li>2. Set up your payment details</li>
                  <li>3. Receive confirmation and impact updates</li>
                </ol>
              </div>

              <Button
                className="w-full"
                onClick={handleDonate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed with Donation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
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
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Choose Your Impact</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a relief fund to make a donation. Your support helps create
              lasting change in communities worldwide.
            </p>
          </div>

          {/* Fund Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {reliefFunds.map((fund) => (
              <FundCard key={fund.id} fund={fund} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Why Your Support Matters
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Sustainable Impact</h4>
                <p className="text-sm text-gray-600">
                  Your donations provide vital support that helps us plan and
                  implement long-term solutions.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Efficient Support</h4>
                <p className="text-sm text-gray-600">
                  Our streamlined donation process reduces administrative costs,
                  ensuring more of your donation goes directly to those in need.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Impact Updates</h4>
                <p className="text-sm text-gray-600">
                  Receive updates about your impact and how your support is
                  making a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
