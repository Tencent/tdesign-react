import {
  ChevronDownIcon as TdChevronDownIcon,
  ChevronLeftIcon as TdChevronLeftIcon,
  ChevronRightIcon as TdChevronRightIcon,
  CloseIcon as TdCloseIcon,
  DownloadIcon as TdDownloadIcon,
  ImageIcon as TdImageIcon,
  MirrorIcon as TdMirrorIcon,
  RotationIcon as TdRotationIcon,
  ZoomInIcon as TdZoomInIcon,
  ZoomOutIcon as TdZoomOutIcon,
} from 'tdesign-icons-react';

import useGlobalIcon from '../../hooks/useGlobalIcon';

const useIconMap = () => {
  const Icons = useGlobalIcon({
    ChevronDownIcon: TdChevronDownIcon,
    ChevronLeftIcon: TdChevronLeftIcon,
    ChevronRightIcon: TdChevronRightIcon,
    CloseIcon: TdCloseIcon,
    DownloadIcon: TdDownloadIcon,
    ImageIcon: TdImageIcon,
    MirrorIcon: TdMirrorIcon,
    RotationIcon: TdRotationIcon,
    ZoomInIcon: TdZoomInIcon,
    ZoomOutIcon: TdZoomOutIcon,
  });

  return {
    rotation: Icons.RotationIcon,
    'zoom-in': Icons.ZoomInIcon,
    mirror: Icons.MirrorIcon,
    'zoom-out': Icons.ZoomOutIcon,
    download: Icons.DownloadIcon,
    image: Icons.ImageIcon,
    'chevron-left': Icons.ChevronLeftIcon,
    'chevron-right': Icons.ChevronRightIcon,
    'chevron-down': Icons.ChevronDownIcon,
    close: Icons.CloseIcon,
  };
};

export default useIconMap;
