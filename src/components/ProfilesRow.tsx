import React, { Fragment } from 'react'
import ProfileButton from './ProfileButton'
import { UpdateState } from '../types'

interface Props {
  diameter: number,
  updateState: UpdateState,
  profile: string
}

const profiles = [{ 
  name: 'car', 
  iconName: 'car'
}, { 
  name: 'foot', 
  iconName: 'male'
},{
  name: 'pilot',
  iconName: 'rocket'
}]

export default function ProfilesRow({ diameter, updateState, profile }: Props) {

  return (
    <Fragment>
      {profiles.map((profileEntry) => {
        return (
          <ProfileButton
            key={profileEntry.name}
            diameter={diameter}
            selectedProfile={profile}
            profile={profileEntry.name}
            iconName={profileEntry.iconName}
            updateState={updateState}
          />
        )
      })}
      
    </Fragment> 
  )
}
