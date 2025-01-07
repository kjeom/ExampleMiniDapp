"use client";

import React, { use, useEffect, useState } from "react";
import { Question } from "../types/index.ts";
import { useWeb3 } from "../context/Web3Provider.tsx";
import { submitAnswer } from "../hooks/browser/survey.tsx";
import { useRouter } from "next/navigation.js";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { useLiff } from "../context/LiffProvider.tsx";

export default function SubmitAnswerForm({
  id,
  questions,
}: {
  id: string;
  questions: Question[];
}) {
  const [members, setMembers] = useState([]);
  const [groupId, setGroupId] = useState("");
  const { provider, identity, account } = useWeb3();
  const { liffObject } = useLiff();
  const router = useRouter();

  useEffect(() => {
    const { members, groupId }: any = getGroup(id);
    setMembers(members);
    setGroupId(groupId);
  }, []);

  const getGroup = async (id: string) => {
    const result = await fetch(`/api/group/members?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status !== 200) {
      console.log("Failed to fetch group members");
      return { members: [], groupId: "" };
    }
    const jsonResult = await result.json();
    return JSON.parse(jsonResult.data);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) {
      alert("Please connect the wallet first!");
      return;
    }
    if (!identity) {
      alert("You need to login with LINE if you want to submit the answer");
      return;
    }
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const signer = await provider.getSigner();
    const ans = Array.from(formData.values()).map((val) =>
      parseInt(val as string)
    );
    const proof = await generateProof(
      identity,
      new Group(members),
      new Uint8Array(ans),
      groupId
    );

    const answer = {
      respondent: signer.address,
      answers: ans,
      merkleTreeDepth: proof.merkleTreeDepth,
      merkleTreeRoot: proof.merkleTreeRoot,
      nullifier: proof.nullifier,
      points: proof.points,
    };
    const receipt = await submitAnswer(id, provider, answer);
    if (receipt.status) {
      alert("Successfully submitted!");
      router.push(`/square/surveys/${id}`);
    } else {
      alert("Failed to submit");
    }
  };

  const joinRequest = async () => {
    if (!provider) {
      alert("Please connect the wallet first!");
      return;
    }
    if (!identity || !liffObject.isLoggedIn()) {
      alert("You need to login with LINE if you want to join the group");
      return;
    }
    const idToken = liffObject.getIDToken();
    const result = await fetch("/api/group/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        commitment: identity.commitment.toString(),
        signature: identity.privateKey,
        idToken,
        account,
      }),
    });

    const receipt = await result.json();
    console.log(receipt);
    if (result.status === 200) {
      alert("Successfully joined the group!");
    } else if (result.status === 500) {
      const error = JSON.parse((await result.json()).error);
      console.log(error);
    } else {
      const error = JSON.parse((await result.json()).error);
      alert(error.shortMessage + ": " + error.reason);
    }
  };

  const isMember = () => {
    if (!identity) return false;
    if (!members) return false;
    console.log(identity);
    console.log(members);
    return identity.commitment.toString() in members;
  };

  return (
    <div className="bg-purple-50 m-3 px-7 py-4 rounded-lg lg:w-3/5 w-80">
      <form onSubmit={submitHandler}>
        <h1 className="font-extrabold text-2xl">Questions</h1>
        {questions.map((question: Question) => (
          <div className="m-3 break-words" key={question.question}>
            <h3 className="font-serif font-semibold mt-2">
              {question.question}
            </h3>
            {question.options.map((option: string, index: number) => (
              <div className="ml-2" key={option}>
                <input
                  name={question.question}
                  type="radio"
                  id={option}
                  value={index}
                />
                <label className="ml-2" htmlFor={option}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <div className="flex flex-row justify-end">
          {isMember() ? (
            <button
              className="bg-purple-400 py-2 px-4 rounded-xl"
              type="submit"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={joinRequest}
              className="bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Join before submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
