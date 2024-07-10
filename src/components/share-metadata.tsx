import React from "react";
import { Helmet } from "react-helmet";

interface ShareMetadataProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

const ShareMetadata: React.FC<ShareMetadataProps> = ({
  title,
  description,
  image,
  url,
}) => {
  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* LinkedIn */}
      <meta name="linkedin:title" content={title} />
      <meta name="linkedin:description" content={description} />
      <meta name="linkedin:image" content={image} />

      {/* Pinterest */}
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={image} />
    </Helmet>
  );
};

export default ShareMetadata;
