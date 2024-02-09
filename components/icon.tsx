import React from 'react'
import VitalikIcon from '../icons/ethereum.svg'
import BrianIcon from '../icons/coinbase.svg'
import FredIcon from '../icons/USV.svg'
import GarryIcon from '../icons/y-combinator.svg'
import ChrisIcon from '../icons/ebay.svg'
import EladIcon from '../icons/Twitter.svg'
import MarcIcon from '../icons/a16z.svg'
import ColinIcon from '../icons/paragraph.svg'
import HorsefactsIcon from '../icons/horsefacts.svg'
import CcarrellaIcon from '../icons/purple.svg'
import AceIcon from '../icons/perl.svg'
import DfIcon from '../icons/mod.svg'
import QualvIcon from '../icons/fxhash.svg'
import LindaIcon from '../icons/bountycaster.svg'
import SamanthaIcon from '../icons/humankind.svg'
import GhostlinkzIcon from '../icons/outcasters.svg'
import JackJackIcon from '../icons/basename.svg'
import DwrIcon from '../icons/farcaster.svg'
import WojIcon from '../icons/supercast.svg'
import TwitterIcon from '../icons/Twitter.svg'
import FarcasterIcon from '../icons/farcaster.svg'
import ParagraphIcon from '../icons/paragraph.svg'
import WowowIcon from '../icons/wowow.svg'

const icons = {
  user: VitalikIcon,
  brian: BrianIcon,
  fred: FredIcon,
  garry: GarryIcon,
  chris: ChrisIcon,
  elad: EladIcon,
  marc: MarcIcon,
  colin: ColinIcon,
  horsefacts: HorsefactsIcon,
  ccarrella: CcarrellaIcon,
  ace: AceIcon,
  df: DfIcon,
  qualv: QualvIcon,
  linda: LindaIcon,
  samantha: SamanthaIcon,
  ghostlinkz: GhostlinkzIcon,
  jackjack: JackJackIcon,
  dwr: DwrIcon,
  woj: WojIcon,
  twitter: TwitterIcon,
  farcaster: FarcasterIcon,
  paragraph: ParagraphIcon,
  wowow: WowowIcon,
}

type IconProps = {
  type: keyof typeof icons
} & React.SVGProps<SVGSVGElement> // Extend with SVG props

export const Icon: React.FC<IconProps> = ({ type, ...props }) => {
  const SvgIcon = icons[type]
  if (!SvgIcon) {
    console.error(`Invalid icon type: ${type}`)
    return null // or return a default icon
  }
  return <SvgIcon {...props} />
}
