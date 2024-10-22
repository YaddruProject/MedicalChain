import { useState } from 'react';

const useCustomState = (initialState) => {
    const [state, setState] = useState(initialState);

    const updateState = (newState) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    };

    return [state, updateState];
};

export default useCustomState;
