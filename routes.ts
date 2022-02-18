import { EmotionJSX } from "@emotion/react/types/jsx-namespace"
import BarrierPass from "@lib/forms/BarrierPass"

type Route = {
  slug: string,
  component: {
    (): EmotionJSX.Element,
    displayName: String
  }
}

const routes: Route[] = [{
  slug: 'barrier-pass',
  component: BarrierPass
}]


export default routes