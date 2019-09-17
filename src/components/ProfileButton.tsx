import React from 'react'
import { Popup } from 'semantic-ui-react'
import BackgroundIcon from './BackgroundIcon'
import { PROFILE_BACKGROUND, PETROL_4, PETROL_1 } from '../utils/colours'
import { capitalize } from '../utils/functions'
import { UpdateState } from '../types'


interface Props {
  diameter: number
  selectedProfile: string
  profile: string
  iconName: string
  updateState: UpdateState
}

export default function ProfileButton({ 
  diameter, 
  selectedProfile, 
  profile, 
  iconName, 
  updateState 
}: Props) {

  const isCurrentProfile = selectedProfile === profile

  return (
    <div id={`${profile}-profile`} onClick={() => updateState('profile', profile)}>
        <Popup
          trigger={
            <div>
              <BackgroundIcon 
                diameter={diameter}
                color={isCurrentProfile ? PROFILE_BACKGROUND : 'transparent'}
                iconColor={isCurrentProfile ? PETROL_4 : PETROL_1}
                circle={false}
                iconName={iconName}
                margin={"0 7px 0 0"}
                cursor="pointer"
              />
            </div>
            }
          content={capitalize(profile)}
          position='top center'
          inverted
          style={{ borderRadius: '7px'}}
        />
      </div>
  )
}
