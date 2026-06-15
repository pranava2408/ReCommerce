import { toast } from "sonner";
import { useEffect, useRef } from "react";

export function ToastScheduler() {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const scheduleToast = (timeout: number, message: string, color: string) => {
      setTimeout(() => {
        toast(message, {
          style: {
            borderLeft: `4px solid ${color}`,
            background: '#FFFFFF',
            color: '#0F1111'
          }
        });
      }, timeout);
    };

    // Cycle
    const runCycle = () => {
      scheduleToast(5000, "Grading Complete: Your Nike Air Max scored 8.5/10", "#10B981"); // Green
      scheduleToast(12000, "Routing Updated: Levi's Jeans scheduled for local pickup", "#3B82F6"); // Blue
      scheduleToast(20000, "New Offer: A buyer submitted ₹1,200 for your iPhone 12", "#FF9900"); // Orange
    };

    runCycle();
    const interval = setInterval(runCycle, 25000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
