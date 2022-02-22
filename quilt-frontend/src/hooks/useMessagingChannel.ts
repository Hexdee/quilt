import { useEffect } from "react";
import { useGunConnection } from "../stores/useGunConnection";
import { useMessages } from "../stores/useMessages";
import { useUserData } from "../stores/useUserData";

export const useMessagingChannel = (recieverAddress: string) => {
  const gun = useGunConnection((state) => state.gun);
  const addMessages = useMessages((state) => state.addMessage);
  const addSelf = useMessages((state) => state.addSelf);
  const userAddress = useUserData((state) => state.address);

  // Listening
  useEffect(() => {
    if (!gun) return;

    const messages = gun.get(userAddress);
    messages.map().on((...props) => {
      const m = props[0];
      addMessages(m);
    });

    return () => {
      messages.off();
    };
  }, [gun, userAddress, addMessages]);

  // Listening to user messages
  useEffect(() => {
    if (!gun) return;
    if (!recieverAddress) return;

    const messages = gun.get(recieverAddress);
    messages.map().on((...props) => {
      const m = props[0];

      if (props[0].name === userAddress) {
        addSelf(m, recieverAddress);
      }
    });

    return () => {
      messages.off();
    };
  }, [gun, recieverAddress, userAddress, addSelf]);
};
