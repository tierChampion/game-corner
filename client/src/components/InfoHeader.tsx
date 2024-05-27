import useGlobalStore from "@/stores/GlobalStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const InfoHeader: React.FC = () => {
    const { userId, roomId } = useGlobalStore();
    return (
        <div className="w-full flex justify-end">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button variant="ghost" size="icon">
                            <InfoCircledIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>{`UserId: ${userId}`}</span>
                        {roomId !== "" && <span className="block">{`RoomId: ${roomId}`}</span>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

export default InfoHeader;
