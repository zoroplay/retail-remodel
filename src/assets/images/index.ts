import b_winners_logo from "../images/b_winners_logo.png";
import maxbet_logo from "../images/maxbet-logo.png";
import sbe_logo from "../images/sbe-logo.png";
import streetbet_logo from "../images/streetbet-logo.png";
import header_bg from "../images/header-bg.png";
import betcruz_logo from "../images/bet-cruz-logo.jpg";
import environmentConfig from "@/store/services/configs/environment.config";
let logo = sbe_logo;
switch (Number(environmentConfig.FRONTEND_CLIENT_ID)) {
  case 13:
    logo = streetbet_logo;
    break;

  case 3:
    logo = maxbet_logo;
    break;
  case 9:
    logo = b_winners_logo;
    break;
  case 10:
    logo = betcruz_logo;
    break;
  default:
    logo = sbe_logo;
    break;
}

export const localImages = {
  // adaptiveIcon: require("./adaptive-icon.png"),
  // favicon: require("./favicon.png"),
  // icon: require("./icon.png"),
  // splashIcon: require("./splash-icon.png"),
  // header_bg: require("./header-bg.png"),
  // // Logos
  logo,
  header_bg,
} as const;

export const remoteImages = {
  placeholder: "https://via.placeholder.com/300x200",
  avatar: "https://via.placeholder.com/100x100",

  profileDefault: "https://example.com/images/default-profile.png",
  bannerImage: "https://example.com/images/banner.jpg",
} as const;

// export const isRemoteImage = (key: ImageKey): key is RemoteImageKey => {
//   return key in remoteImages;
// };

// export const images = {
//   ...localImages,
//   ...remoteImages,
// } as const;
