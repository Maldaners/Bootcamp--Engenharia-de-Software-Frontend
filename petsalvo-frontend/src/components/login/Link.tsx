import React, { AnchorHTMLAttributes } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    center: boolean;
    text: string;
}

const Link: React.FC<LinkProps> = ({center,text, ...props}) => {
    const className = `select-none text-black cursor-pointer${center ? ' text-center' : ''}`;
    return (
        <a {...props} className={className}>{text}</a>                  
    );
}

export default Link