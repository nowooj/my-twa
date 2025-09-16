import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';
import { useEffect } from 'react';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({
      walletsListConfiguration: {
        includeWallets: [
          {
            appName: "stower",
            universalLink: "https://bridge.dev.delightlabs.team/bridge",
            bridgeUrl: "https://bridge.dev.delightlabs.team/bridge",
            aboutUrl: "https://tonkeeper.com",
            imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
            name: "STOWER",
            platforms: ["ios", "android", "chrome", "firefox", "safari", "windows", "macos", "linux"],
            features: [
              {
                name: "SendTransaction",
                maxMessages: 4,
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