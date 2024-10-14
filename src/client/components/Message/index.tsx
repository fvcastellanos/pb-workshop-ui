import { Alert } from "react-bootstrap";
import { FieldErrorView } from "../../domain/FieldErrorView";

export default function Message({
    show = false, 
    title = '',
    message = '', 
    variant = 'info',
    dismissible = false,
    fieldErrors = [],
    details = [],
    onDismiss = () => {},    
}) {

    return (
        <>
        { show && 
            <Alert variant={variant} dismissible={dismissible} onClose={onDismiss}>
                <Alert.Heading>{title}</Alert.Heading>
                <p>{message}</p>
                <hr />
                {(fieldErrors.length > 0 || details.length > 0) && 
                    <p className="mb-0">
                        {
                            fieldErrors.map((fieldError: FieldErrorView, index) => {
                                return (
                                    <li key={index}>{`${fieldError.fieldName} con valor: ${fieldError.fieldValue}: ${fieldError.error}`}</li>
                                );
                            })
                        }

                        {
                            details.map((detail, index) => {
                                return (
                                    <li key={index}>{detail}</li>
                                );
                            })                        
                        }
                    </p>
                }
            </Alert>
        }
        </>
    );

}