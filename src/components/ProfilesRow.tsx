import React, { Fragment } from 'react'
import { UpdateState } from '../types'
import ProfileButton from './ProfileButton'

interface Props {
  diameter: number
  updateState: UpdateState
  profile: string
}

const profiles = [
  {
    iconName: 'car',
    name: 'car'
  },
  {
    iconName: 'male',
    name: 'foot'
  },
  {
    iconName: 'rocket',
    name: 'pilot'
  }
]

export default function ProfilesRow({ diameter, updateState, profile }: Props) {
  return (
    <Fragment>
      {profiles.map(profileEntry => {
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
