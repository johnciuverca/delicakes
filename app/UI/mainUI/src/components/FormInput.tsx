import { useState } from "react";

type FormInputProps = {
	id: string;
	inputType: "text " | "password";
    placeholder?: string;
}

export function FormInput(props: FormInputProps) {
	const [value, setValue] = useState("");
	
	return (
		<>
			<label htmlFor={props.id}>{props.placeholder}</label>
			<input 
				id={props.id} 
				value={value}
				type="password" 
				placeholder={props.placeholder}
				onChange={(e) => setValue(e.target.value)} 
			/>
		</>
	);
}