
export default function InputErrorMessage({touched, error}) {

    if (!error || !touched) {
        return null;
    }

    return (
        <small className='p-error' style={{display: 'block'}}>{error}</small>
    );
}