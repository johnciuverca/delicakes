import { useState } from "react";

type FormInputProps = {
	id: string;
	inputType: "text " | "password";
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function FormInput(props: FormInputProps) {
	const [value, setValue] = useState("");
	
	return (
		<>
			<label htmlFor={props.id}>{props.placeholder}</label>
			<input 
				id={props.id} 
				value={props.value ?? value}
				type={props.inputType} 
				placeholder={props.placeholder}
				onChange={props.onChange ?? ((e) => setValue(e.target.value))}
                onBlur={props.onBlur}
			/>
		</>
	);
}