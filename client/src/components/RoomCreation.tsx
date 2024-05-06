interface RoomCreationText {
    text: string;
}

const RoomCreationButton: React.FC<RoomCreationText> = ({text}) => {
    
    const createRoom = () => {

    };

    return (
        <button>
            {text}
        </button>
    );
};

export default RoomCreationButton;