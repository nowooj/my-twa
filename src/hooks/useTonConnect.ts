import { useTonConnectUI } from '@tonconnect/ui-react';
import type { Sender, SenderArguments } from '@ton/core';
import { useEffect } from 'react';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({
      walletsListConfiguration: {
        includeWallets: [
          {
            appName: "stower",
            name: "STOWER",
            imageUrl: "https://assets.stower.money/STOWER-logo_288x288.png",
            aboutUrl: "https://stower.money",
            universalLink: "https://bridge.stower.money/bridge",
            deepLink: "stower-tc://",
            bridgeUrl: "https://bridge.stower.money/bridge",
            platforms: ["ios", "android"],
            features: [
              {
                name: "SendTransaction",
                maxMessages: 255,
                extraCurrencySupported: false
              }
            ]
          }
        ]
      }
    });
  }, [setOptions]);
  
  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}