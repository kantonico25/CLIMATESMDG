import React from "react";

type Source = {
  type: string;
  srcSet: string;
  sizes: string;
};

type ResponsiveImageProps = {
  sources: Source[];
  dataSaverSources?: Source[];
  imgSrc: string;
  dataSaverImgSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  ariaHidden?: boolean;
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  sources,
  dataSaverSources,
  imgSrc,
  dataSaverImgSrc,
  alt,
  className,
  imgClassName,
  loading,
  decoding,
  fetchPriority,
  ariaHidden,
}) => {
  const [useDataSaver, setUseDataSaver] = React.useState(false);

  React.useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (connection?.saveData) {
      setUseDataSaver(true);
      return;
    }
    if (connection?.effectiveType && ["slow-2g", "2g"].includes(connection.effectiveType)) {
      setUseDataSaver(true);
    }
  }, []);

  const resolvedSources = useDataSaver && dataSaverSources ? dataSaverSources : sources;
  const resolvedImgSrc = useDataSaver && dataSaverImgSrc ? dataSaverImgSrc : imgSrc;

  return (
    <picture className={className} aria-hidden={ariaHidden}>
      {resolvedSources.map((source) => (
        <source key={`${source.type}-${source.srcSet}`} type={source.type} srcSet={source.srcSet} sizes={source.sizes} />
      ))}
      <img
        src={resolvedImgSrc}
        alt={alt}
        className={imgClassName}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
};

export default ResponsiveImage;

