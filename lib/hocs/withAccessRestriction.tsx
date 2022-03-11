import UserContext from '@lib/conxtexts/userContext';
import { UserAccessType } from '@lib/models/user';
import readData, { ReadDataResultCodes } from '@lib/services/readData';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'

type PropsAreEqual<P> = (
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
) => boolean;

const withAccessRestricion = <P extends { loading: boolean }>(
  component: {
    (props: P): Exclude<React.ReactNode, undefined>;
    displayName?: string;
    accessLevel: UserAccessType
  },
  propsAreEqual?: PropsAreEqual<P> | false,

  componentName = component.displayName ?? component.name
): {
  (props: P): JSX.Element;
  displayName: string;
} => {

  function WithAccessRestriction(props: P) {
    const [loading, setLoading] = useState(true)
    const { user } = useContext(UserContext)
    const router = useRouter()
    
    useEffect(() => {
      readData('users', user?.uid ?? '')
        .then(result => {
          if (result.code === ReadDataResultCodes['SUCCESS'] && result.data.access_type < component.accessLevel) {
            router.push('/')
          }
          setLoading(false)
        })
    }, [user, router])


    //Do something special to justify the HoC.
    return component({...props, loading}) as JSX.Element;
  }

  WithAccessRestriction.displayName = `withAccessRestriction(${componentName})`;

  let wrappedComponent = propsAreEqual === false ? WithAccessRestriction : React.memo(WithAccessRestriction, propsAreEqual);

  //copyStaticProperties(component, wrappedComponent);

  return wrappedComponent as typeof WithAccessRestriction
};

export default withAccessRestricion