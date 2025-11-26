// src/components/inputs/AppImage.tsx

import React, { useState } from "react";
import { AppHelper } from "../../lib/helper";
import { ImageKey } from "../../data/types/helpers";

interface AppImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  imageKey: ImageKey;
  fallbackSource?: string;
  className?: string;
}

export const AppImage: React.FC<AppImageProps> = ({
  imageKey,
  fallbackSource,
  className = "",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const imageSource = AppHelper.getImageSource(imageKey);

  // Handle image loading errors
  const handleError = () => {
    setHasError(true);
  };

  // Determine which source to use
  const src =
    hasError && fallbackSource
      ? fallbackSource
      : typeof imageSource === "string"
      ? imageSource
      : imageSource.uri || imageSource;

  return (
    <img
      src={src as string}
      className={className}
      onError={handleError}
      {...props}
      alt={props.alt || ""} // Ensure alt text for accessibility
    />
  );
};

// // Convenience components for common use cases
// export const LocalImage: React.FC<
//   Omit<AppImageProps, "imageKey"> & {
//     imageKey: keyof typeof import("@/assets/images").localImages;
//   }
// > = (props) => {
//   return <AppImage {...props} />;
// };

// export const RemoteImage: React.FC<
//   Omit<AppImageProps, "imageKey"> & {
//     imageKey: keyof typeof import("@/assets/images").remoteImages;
//   }
// > = (props) => {
//   return <AppImage {...props} />;
// };

export default AppImage;
