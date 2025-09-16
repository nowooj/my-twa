import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address } from '@ton/core';
import type { OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQDvw_NERYkcTOH7n3bliGXkNUkLxbIPJtAihG6vUYa4aC6v') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    if (!counterContract) return;

    let isActive = true;

    async function getValue() {
      if (!isActive || !counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      if (isActive) {
        setVal(val.toString());
        // 5초 후에 다시 실행
        setTimeout(() => {
          if (isActive) {
            getValue();
          }
        }, 5000);
      }
    }

    getValue();

    // cleanup function
    return () => {
      isActive = false;
    };
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}