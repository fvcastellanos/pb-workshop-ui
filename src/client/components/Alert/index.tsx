
import { XCircleFill } from 'react-bootstrap-icons';

const Alert = ({ show, 
                 message, 
                 variant = 'info',
                 dismissible = false,
                 onDismiss = () => {},
                 }) => {

    const alertType = `alert alert-${variant} alert-dismissible fade show`;

    return (
        <>
        { show && 
            <div className={alertType} role="alert" style={{marginTop: '1em', marginBottom: '1em'}} data-testid='alert-component'>

                <div className='row'>
                    <div className='col-11'>
                        {message}
                    </div>
                    {
                        dismissible &&
                        <div className='col-1'>
                            <button type="button" className={"btn icon-action"} onClick={onDismiss}>
                                <XCircleFill />
                            </button>
                        </div>
                    }
                </div>

            </div>        
        }
        </>

    );

};

export default Alert;