import "../styles/index.css"
import { Button } from "@/components/ui/button"

const TestPage: React.FC = () => {
    return (
        <>
            <div className="text-3xl">Nice to meet you</div>
            <Button>
                Hello world!
            </Button>
        </>
    );
}

export default TestPage;
