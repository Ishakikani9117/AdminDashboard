import React from 'react'
import CustomAvatar from './custom-avatar';
import { Text } from './text';

type Props= {
    name: string;
    avatarUrl?: string;
    shape?: 'circle' | 'square';
}
const SelectOptionWithAvatar = ({avatarUrl, name, shape}: Props) => {
  return (
    <div
     style={{
        display:'flex',
        alignItems: 'center',
        gap:'8px'
     }}
    >
     <CustomAvatar name={name} src={avatarUrl} shape={shape}  />
     <Text>{name}</Text>
    </div>
  )
}

export default SelectOptionWithAvatar