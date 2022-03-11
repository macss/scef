import React from 'react'
import withAccessRestricion from '@lib/hocs/withAccessRestriction'
import { USER_ACCESS_TYPE } from '@lib/models/user'

const UserApprovalPage = () => {
  return (
    <div>UserApprovalPage</div>
  )
}

UserApprovalPage.displayName = 'Aprovar Usuários'

const UserApprovalWithAccessRestriction = withAccessRestricion(UserApprovalPage, USER_ACCESS_TYPE.Admnistrador)

UserApprovalWithAccessRestriction.displayName = 'Aprovar Usuários'

export default UserApprovalWithAccessRestriction