import UserContext from '@lib/conxtexts/userContext';
import { USER_ACCESS_TYPE } from '@lib/models/user';
import readData from '@lib/services/readData';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'

type PropsAreEqual<P> = (
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
) => boolean;

const withAccessRestricion = <P extends {}>(
  component: {
    (props: P): Exclude<React.ReactNode, undefined>;
    displayName?: string;
  },
  access: USER_ACCESS_TYPE,
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
          if (result.code === 'SUCCESS' && result.data.access_type < access) {
            console.log('bloqueado')
            router.push('/')
          }
          setLoading(false)
        })
    }, [user, router])

    if (loading) {
      return (
        <div>Carregando...</div>
      )
    }

    //Do something special to justify the HoC.
    return component(props) as JSX.Element;
  }

  WithAccessRestriction.displayName = `withAccessRestriction(${componentName})`;

  let wrappedComponent = propsAreEqual === false ? WithAccessRestriction : React.memo(WithAccessRestriction, propsAreEqual);

  //copyStaticProperties(component, wrappedComponent);

  return wrappedComponent as typeof WithAccessRestriction
};

export default withAccessRestricion