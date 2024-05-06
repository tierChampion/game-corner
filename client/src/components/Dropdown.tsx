interface DropdownList {
    list: string[];
}

const Dropdown: React.FC<DropdownList> = ({ list }) => {
    return (
        <select>
            {list.map((element, index) => {
                return <option key={index}>{element}</option>
            })}
        </select>
    );
};

export default Dropdown;