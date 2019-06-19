import React, { Fragment } from 'react'
import BackgroundIcon from './BackgroundIcon'
import { Popup } from 'semantic-ui-react'
import { UpdateState } from '../types'
import { PETROL_4, PETROL_1, PROFILE_BACKGROUND } from '../utils/colours'

interface Props {
  diameter: number,
  updateState: UpdateState,
  profile: string
}

export default function ProfilesRow({ diameter, updateState, profile }: Props) {
  return (
    <Fragment>
      <div id={'car-profile'} onClick={() => updateState('profile', 'car')}>
        <Popup
          trigger={
            <div>
              <BackgroundIcon 
                diameter={diameter}
                color={profile === 'car' ? PROFILE_BACKGROUND : 'transparent'}
                iconColor={profile === 'car' ? PETROL_4 : PETROL_1}
                circle={false}
                iconName={'car'}
                margin={"0 7px 0 0"}
                cursor="pointer"
              />
            </div>}
          content="Car"
          position='top center'
          inverted
          style={{ borderRadius: '7px'}}
        />
      </div>
      <div id={'foot-profile'} onClick={() => updateState('profile', 'foot')}>
        <Popup
          trigger={
            <div>
              <BackgroundIcon 
                diameter={diameter}
                color={profile === 'foot' ? PROFILE_BACKGROUND : 'transparent'}
                iconColor={profile === 'foot' ? PETROL_4 : PETROL_1}
                circle={false}
                iconName={'male'}
                margin={"0 7px 0 0"}
                cursor="pointer"
              />
            </div>
            }
          content="Foot"
          position='top center'
          inverted
          style={{ borderRadius: '7px'}}
        />
      </div>
    </Fragment> 
  )
}
