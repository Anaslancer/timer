import styled from 'styled-components';

const StyledInput = styled.input<{ running: string }>`
  padding: 5px;
  width: 60px;
  margin-right: 5px;
  background-color: ${({ running }) => (running === 'true' ? '#d3d3d3' : 'White')};
`;

const StyledDescription = styled.label`
    font-size: 0.5rem;
`;

interface InputProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    running?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
}

const InputField: React.FC<InputProps> = ({
    value,
    onChange,
    disabled,
    running = false,
    placeholder = '', // Default value
    min = 0, // Default value
    max = 100, // Default value
  }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <StyledDescription htmlFor={placeholder}>{placeholder}</StyledDescription>
            <StyledInput 
                type="number" 
                value={value} 
                onChange={onChange} 
                disabled={disabled} 
                running={running.toString()} 
                placeholder={placeholder} 
                min={min} 
                max={max} 
            />
        </div>
    );
};

export default InputField;
