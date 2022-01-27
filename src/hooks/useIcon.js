//icon
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

export const useIcon = (text) => {

    const [icon, setIcon] = useState('')

    switch (text) {
        case text.includes('taxi'):
            setIcon("mdi:taxi")
            break;
        case text.includes('rent'):
            setIcon("mdi:home")
        default:
            break;
    }

    return { icon }
}

