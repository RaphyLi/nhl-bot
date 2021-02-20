import { container } from '../dependency-container';
import { constructor } from '../type/constructor';

export const Injectable = (): (target: constructor<any>) => void => {
    return (target: constructor<any>) => {
        // do something if needed
        container.resolve(target);
    };
};

