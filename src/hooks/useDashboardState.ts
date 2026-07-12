import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { TimeOfDay } from "../types/Types";

const useCurrentDate = () => {
  const queryClient = useQueryClient();
  const { data: currentDate = format(new Date(), "yyyy-MM-dd") } = useQuery<string>({
    queryKey: ["currentDate"],
    queryFn: () => format(new Date(), "yyyy-MM-dd"),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setCurrentDate = (date: string) => {
    queryClient.setQueryData(["currentDate"], date);
  };

  return [currentDate, setCurrentDate] as const;
};

const useNewFoodBarCode = () => {
  const queryClient = useQueryClient();
  const { data: newFoodBarCode = "" } = useQuery<string>({
    queryKey: ["newFoodBarCode"],
    queryFn: () => "",
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setNewFoodBarCode = (barcode: string) => {
    queryClient.setQueryData(["newFoodBarCode"], barcode);
  };

  return [newFoodBarCode, setNewFoodBarCode] as const;
};

const useIsSearchOpen = () => {
  const queryClient = useQueryClient();
  const { data: isSearchOpen = false } = useQuery<boolean>({
    queryKey: ["isSearchOpen"],
    queryFn: () => false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setIsSearchOpen = (isOpen: boolean) => {
    queryClient.setQueryData(["isSearchOpen"], isOpen);
  };

  return [isSearchOpen, setIsSearchOpen] as const;
};

const useActiveTimeFrame = () => {
  const queryClient = useQueryClient();
  const { data: activeTimeFrame = "breakfast" } = useQuery<TimeOfDay>({
    queryKey: ["activeTimeFrame"],
    queryFn: () => "breakfast",
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setActiveTimeFrame = (timeFrame: TimeOfDay) => {
    queryClient.setQueryData(["activeTimeFrame"], timeFrame);
  };

  return [activeTimeFrame, setActiveTimeFrame] as const;
};

export { useCurrentDate, useNewFoodBarCode, useIsSearchOpen, useActiveTimeFrame };
