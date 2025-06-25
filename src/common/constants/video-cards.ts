export enum VideoCardType {
    GTX_1660 = 'GTX_1660',
    RTX_3060 = 'RTX_3060',
    RTX_3080 = 'RTX_3080',
    RTX_4090 = 'RTX_4090',
  }
  
  export interface VideoCardInfo {
    name: string;
    hashRate: number;
    price: number;
  }
  
  export const videoCardData: Record<VideoCardType, VideoCardInfo> = {
    [VideoCardType.GTX_1660]: {
      name: 'GTX 1660',
      hashRate: 0.0002,
      price: 200,
    },
    [VideoCardType.RTX_3060]: {
      name: 'RTX 3060',
      hashRate: 0.0005,
      price: 350,
    },
    [VideoCardType.RTX_3080]: {
      name: 'RTX 3080',
      hashRate: 0.0009,
      price: 700,
    },
    [VideoCardType.RTX_4090]: {
      name: 'RTX 4090',
      hashRate: 0.0015,
      price: 1600,
    },
  };
  