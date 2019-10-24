import React from 'react'
import { Popup } from 'semantic-ui-react'
import { UpdateState } from '../types'
import { PETROL_1, PETROL_4, PROFILE_BACKGROUND } from '../utils/colours'
import { capitalize } from '../utils/functions'
import BackgroundIcon from './BackgroundIcon'

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
              margin={'0 7px 0 0'}
              cursor="pointer"
            />
          </div>
        }
        content={capitalize(profile)}
        position="top center"
        inverted={true}
        style={{ borderRadius: '7px' }}
      />
    </div>
  )
}
