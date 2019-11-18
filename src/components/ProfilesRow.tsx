import React, { Fragment } from 'react'
import { ProfileItem, UpdateState } from '../types'
import ProfileButton from './ProfileButton'

interface Props {
  diameter: number
  updateState: UpdateState
  profile: string
  profiles: ProfileItem[]
}

export default function ProfilesRow({ diameter, updateState, profile, profiles }: Props) {
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
