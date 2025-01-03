"use client";

import React from "react";
import { useWeb3 } from "../../context/Web3Provider";
import { useLiff } from "../../context/LiffProvider";

export default function JoinBtn({ id }: { id: string }) {
  const { provider, account, identity } = useWeb3();
  const { liffObject } = useLiff();

  const joinRequest = async () => {
    if (!provider) {
      alert("Please connect the wallet first!");
      return;
    }
    if (!identity) {
      alert("You need to login with LINE if you want to join the group");
      return;
    }
    const idToken = liffObject.getIdToken();
    const receipt = await fetch("/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        commitment: identity.commitment,
        signature: identity.privateKey,
        idToken,
        account,
      }),
    });
    if (receipt.status === 1) {
      alert("Successfully joined the group!");
    } else {
      alert("Failed to join the group");
    }
  };

  return (
    <button
      onClick={joinRequest}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
    >
      Join First Before Answering{" "}
    </button>
  );
}