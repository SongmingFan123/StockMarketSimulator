interface ErrorMessageContainerProps {
    errorMessage: string;
}
export default function ErrorMessageContainer({errorMessage} : ErrorMessageContainerProps) {
  return (<p className="bg-white text-red-500 p-2 rounded border border-red-500">{errorMessage}</p>);
}
