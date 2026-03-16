import { useCallback, useMemo, useState } from "react";

type ErrorMessage = string;
type ValidationResult = ErrorMessage | null;
type Validator = (value: string) => ValidationResult;

type FormInputProps = {
	id: string;
	inputType: "text " | "password";
    placeholder?: string;
	value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlurValidation?: Validator | Array<Validator>;
}

export function FormInput(props: FormInputProps): React.JSX.Element {
	const [value, setValue] = useState<string>(props.value ?? "");
	const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
	
	const handleBlur = useCallback(() => {
		if (!props.onBlurValidation) {
			setErrorMessage(null);
			return;
		}
		
		if (Array.isArray(props.onBlurValidation)) {
			for (const validator of props.onBlurValidation) {
				const validationMsg = validator(value);
				if (validationMsg) {
					setErrorMessage(validationMsg);
					return;
				}
			}
			setErrorMessage(null);
			return;
		}
		
		const validationMsg = props.onBlurValidation?.(value) ?? null;
		setErrorMessage(validationMsg);
	}, [value, props.onBlurValidation]);
	
    const displayableError = useMemo(() => {
		if (!errorMessage) return null;
		return (<div>{errorMessage}</div>);
	}, [errorMessage]);
	
	return (
		<>
			<label htmlFor={props.id}>{props.placeholder}</label>
			<input 
				id={props.id} 
				value={value}
				type={props.inputType} 
				placeholder={props.placeholder}
				onChange={e => {
					setValue(e.target.value);
					props.onChange?.(e);
				}}
                onBlur={handleBlur}
			/>
            {displayableError}
		</>
	);
}