import "@/styles/index.css"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import InfoHeader from "@/components/InfoHeader";
import RoomCreationButton from "@/components/RoomCreationButton";

const HomePage: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col bg-slate-400">
            <InfoHeader />
            <div className="w-full flex flex-col items-center justify-around grow">
                <Label className="text-8xl">Game Corner</Label>
                <div className="w-full flex flex-row justify-center items-center gap-4">
                    <RoomCreationButton/>
                    <Link to="/join">
                        <Button>
                            Join room
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;