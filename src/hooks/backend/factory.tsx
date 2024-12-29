import { ethers } from "ethers";
import { provider } from "../common/provider.tsx";
import factoryAbi from "../../contracts/SurveyFactoryV1.sol/SurveyFactoryV1.json";

export const getSurveyV1s = async () => {
  const surveyFactoryAddr = process.env.SURVEY_FACTORY_V1_CONTRACT_ADDRESS;
  if (!surveyFactoryAddr) {
    throw Error("Invalid survey factory address");
  }
  const factoryV1 = new ethers.Contract(
    surveyFactoryAddr,
    factoryAbi.abi,
    provider
  );
  return await factoryV1.getSurveys();
};
