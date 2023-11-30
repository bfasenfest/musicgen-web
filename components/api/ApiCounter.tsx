import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/lib/modal-store";

import { useApiStore } from "@/lib/api-store";

export const ApiCounter = ({
  subStatus = "trial",
  apiLimitCount = 0,
}: {
  subStatus: string;
  apiLimitCount: number;
}) => {
  const { checkSubscription } = useApiStore();

  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  //   apiLimitCount = 40;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const openStripePortal = async () => {
    try {
      const response: any = await fetch("/api/stripe-portal", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let session = await response.json();

      console.log(session);

      window.location.href = session.url;
    } catch (error) {
      alert(error);
    } finally {
    }
  };

  if (subStatus === "active") {
    return (
      <div className="flex flex-col items-center">
        <h1 className="font-bold">
          Thank you for supporting us with MusicGen Pro!
        </h1>
        <Button
          onClick={openStripePortal}
          variant="outline"
          className="w-4/6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white"
        >
          Manage your subscription <Zap className="w-4 h-4 ml-2 fill-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-black mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          {subStatus === "canceled" ? (
            <div className="flex flex-col items-center">
              <h1 className="font-bold">
                Would you like to renew your subscription?
              </h1>
              <Button
                onClick={openStripePortal}
                variant="outline"
                className="w-4/6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white"
              >
                Manage your subscription{" "}
                <Zap className="w-4 h-4 ml-2 fill-white" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={proModal.onOpen}
              variant="outline"
              className="w-full"
            >
              Upgrade to Pro for Unlimited Generations
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiCounter;
