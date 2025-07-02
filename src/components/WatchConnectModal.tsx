
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Watch, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WatchConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WatchType = "apple" | "fitbit" | "garmin" | "samsung" | "";

const WatchConnectModal: React.FC<WatchConnectModalProps> = ({ open, onOpenChange }) => {
  const [selectedWatch, setSelectedWatch] = useState<WatchType>("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!selectedWatch) return;
    
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      
      toast({
        title: "Smartwatch Connected!",
        description: `Your ${getWatchName(selectedWatch)} has been successfully connected.`,
        variant: "default",
      });
      
      // Close modal after showing success for a moment
      setTimeout(() => {
        onOpenChange(false);
        // Reset state for next time
        setTimeout(() => {
          setConnected(false);
          setSelectedWatch("");
        }, 300);
      }, 1500);
    }, 2000);
  };
  
  const getWatchName = (type: WatchType): string => {
    switch(type) {
      case "apple": return "Apple Watch";
      case "fitbit": return "Fitbit";
      case "garmin": return "Garmin";
      case "samsung": return "Samsung Galaxy Watch";
      default: return "";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5" />
            Connect Your Smartwatch
          </DialogTitle>
          <DialogDescription>
            Link your smartwatch to get personalized recommendations based on your health data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!connecting && !connected ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-3">
                Select your smartwatch type:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedWatch("apple")}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    selectedWatch === "apple" ? "border-wellness-blue bg-wellness-blue/10" : "hover:border-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">⌚</span>
                  </div>
                  <span className="font-medium">Apple Watch</span>
                </button>
                
                <button
                  onClick={() => setSelectedWatch("fitbit")}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    selectedWatch === "fitbit" ? "border-wellness-blue bg-wellness-blue/10" : "hover:border-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">F</span>
                  </div>
                  <span className="font-medium">Fitbit</span>
                </button>
                
                <button
                  onClick={() => setSelectedWatch("garmin")}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    selectedWatch === "garmin" ? "border-wellness-blue bg-wellness-blue/10" : "hover:border-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">G</span>
                  </div>
                  <span className="font-medium">Garmin</span>
                </button>
                
                <button
                  onClick={() => setSelectedWatch("samsung")}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    selectedWatch === "samsung" ? "border-wellness-blue bg-wellness-blue/10" : "hover:border-gray-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">S</span>
                  </div>
                  <span className="font-medium">Samsung</span>
                </button>
              </div>
            </div>
          ) : connecting ? (
            <div className="py-8 flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-wellness-blue animate-spin mb-4" />
              <p className="font-medium text-lg">Connecting...</p>
              <p className="text-muted-foreground text-sm mt-2">
                Please follow any pairing instructions on your {getWatchName(selectedWatch)}
              </p>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="font-medium text-lg">Successfully Connected!</p>
              <p className="text-muted-foreground text-sm mt-2">
                Your {getWatchName(selectedWatch)} is now linked to your LifeSpark AI account.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={connecting}
          >
            {connected ? "Close" : "Cancel"}
          </Button>
          
          {!connected && (
            <Button 
              onClick={handleConnect} 
              disabled={!selectedWatch || connecting}
              className={connecting ? "" : "bg-wellness-blue hover:bg-wellness-blue/90"}
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting
                </>
              ) : (
                "Connect Device"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WatchConnectModal;
