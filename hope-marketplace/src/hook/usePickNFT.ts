import { useCallback, useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import Collections, { MarketplaceInfo } from "../constants/Collections";

const usePickNFT = () => {
  const nfts = useAppSelector((state) => state.nfts);

  const totalNFTs = useMemo(() => {
    let total: any = [];
    Collections.forEach((collection: MarketplaceInfo) => {
      const collectionId = collection.collectionId;
      const listedKey = `${collectionId}_listed`;
      const marketplaceKey = `${collectionId}_marketplace`;
      if (nfts[collectionId] && nfts[collectionId].length)
        total = total.concat(nfts[collectionId]);
      if ((nfts as any)[listedKey] && (nfts as any)[listedKey].length)
        total = total.concat((nfts as any)[listedKey]);
      if ((nfts as any)[marketplaceKey] && (nfts as any)[marketplaceKey].length)
        total = total.concat((nfts as any)[marketplaceKey]);
    });
    return total;
  }, [nfts]);

  const pickNFTByTokenId = useCallback(
    (id: string) => {
      let targetNFT = {};
      for (let i = 0; i < totalNFTs.length; i++) {
        const crrNFT: any = totalNFTs[i];
        if (crrNFT.token_id === id) {
          targetNFT = crrNFT;
          break;
        }
      }
      return targetNFT;
    },
    [totalNFTs]
  );

  return { pickNFTByTokenId };
};

export default usePickNFT;
