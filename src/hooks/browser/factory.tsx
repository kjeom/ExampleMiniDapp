import { ethers } from "ethers";
import { provider } from "../common/provider";
import factoryAbi from "../../contracts/SurveyFactoryV1.sol/SurveyFactoryV1.json";
import { Question } from "../../types";

const factoryV1 = new ethers.Contract(
  process.env.NEXT_PUBLIC_SURVEY_FACTORY_V1_CONTRACT_ADDRESS || "",
  factoryAbi.abi,
  provider
);

const getFactoryV1 = (signer: ethers.JsonRpcSigner) => {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_SURVEY_FACTORY_V1_CONTRACT_ADDRESS || "",
    factoryAbi.abi,
    signer
  );
};

export const createSurvey = async ({
  provider,
  title,
  desc,
  questions,
  targetNumber,
  duration,
  rewardPool,
}: {
  provider: ethers.BrowserProvider;
  title: string;
  desc: string;
  //   questions: Question[];
  questions: Question[];
  targetNumber: ethers.BigNumberish;
  duration: ethers.BigNumberish;
  rewardPool: ethers.BigNumberish;
}) => {
  provider
    .getBalance((await provider.getSigner(0)).address)
    .then((balance: ethers.BigNumberish) => {
      // balance check
      if (balance.valueOf() < rewardPool) {
        throw new Error("Insufficient balance");
      }
    });

  const fV1 = getFactoryV1(await provider.getSigner(0));
  const tx = await fV1.createSurvey(
    title,
    desc,
    questions,
    targetNumber,
    duration,
    {
      value: ethers.parseEther(rewardPool.toString()),
    }
  );
  const receipt = await tx.wait();
  const surveyContractAddress = fV1.interface.parseLog(receipt.logs[2]);
  const status = receipt.status;
  if (!surveyContractAddress) {
    throw new Error("Survey contract address is null");
  }
  return {
    status,
    surveyContractAddress,
  };
};

export const getSurveyV1s = async () => {
  const surveyAddresses = await factoryV1.getSurveys();
  return surveyAddresses;
};
