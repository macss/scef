import { EmotionJSX } from "@emotion/react/types/jsx-namespace"
import BarrierPassForm from "@lib/forms/BarrierPassForm"

type Route = {
  slug: string,
  component: {
    (): EmotionJSX.Element,
    displayName: String
  }
}

const routes: Route[] = [{
  slug: 'barrier-pass',
  component: BarrierPassForm
}]


export default routes