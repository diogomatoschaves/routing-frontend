import React, { Fragment } from 'react'
import BackgroundIcon from './BackgroundIcon'
import { Popup } from 'semantic-ui-react'
import { Box, StyledIcon, EmptySpace } from '../styledComponents'
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
      <Popup
        trigger={
          <div onClick={() => updateState('profile', 'car')}>
            <BackgroundIcon 
              diameter={diameter}
              color={profile === 'car' ? PROFILE_BACKGROUND : undefined}
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
      <Popup
        trigger={
          <div onClick={() => updateState('profile', 'foot')}>
            <BackgroundIcon 
              diameter={diameter}
              color={profile === 'foot' ? PROFILE_BACKGROUND : undefined}
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
    </Fragment> 
  )
}
